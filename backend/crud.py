"""
CRUD operations handling database transactions cleanly and concisely.
"""
import re
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
import models
import schemas


def get_meetings(
    db: Session,
    query: Optional[str] = None,
    participant: Optional[str] = None,
    sort_by: str = "newest"
) -> List[schemas.MeetingListItem]:
    """Retrieve all meetings with filtering, searching, and counts."""
    db_query = db.query(models.Meeting)

    if query:
        search_fmt = f"%{query}%"
        db_query = db_query.filter(
            or_(
                models.Meeting.title.ilike(search_fmt),
                models.Meeting.participants.ilike(search_fmt),
                models.Meeting.overview_summary.ilike(search_fmt)
            )
        )

    if participant:
        db_query = db_query.filter(models.Meeting.participants.ilike(f"%{participant}%"))

    if sort_by == "oldest":
        db_query = db_query.order_by(models.Meeting.date.asc(), models.Meeting.id.asc())
    elif sort_by == "longest":
        db_query = db_query.order_by(models.Meeting.duration_seconds.desc())
    elif sort_by == "shortest":
        db_query = db_query.order_by(models.Meeting.duration_seconds.asc())
    else:  # newest / recency
        db_query = db_query.order_by(models.Meeting.date.desc(), models.Meeting.id.desc())

    meetings = db_query.all()
    results = []
    for m in meetings:
        item = schemas.MeetingListItem(
            id=m.id,
            title=m.title,
            date=m.date,
            duration_seconds=m.duration_seconds,
            participants=m.participants,
            audio_url=m.audio_url,
            overview_summary=m.overview_summary,
            created_at=m.created_at,
            action_items_count=len(m.action_items),
            completed_action_items_count=len([a for a in m.action_items if a.is_completed]),
            segments_count=len(m.segments)
        )
        results.append(item)
    return results


def get_meeting(db: Session, meeting_id: int) -> Optional[models.Meeting]:
    """Fetch single meeting with all nested relationships."""
    return db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()


def parse_raw_transcript_lines(raw_text: str) -> List[dict]:
    """
    Utility to parse plain text transcripts formatted like:
    'Sarah Chen (00:15): Let us review the roadmap.' or 'Alex: Looks good.'
    """
    segments = []
    lines = [line.strip() for line in raw_text.strip().split("\n") if line.strip()]
    current_time = 0.0

    for idx, line in enumerate(lines):
        # Match pattern: Speaker (MM:SS or S): Text OR Speaker: Text
        match = re.match(r"^([^:]+?)(?:\s*\((?:(\d+):)?(\d+)\))?:\s*(.*)$", line)
        if match:
            speaker = match.group(1).strip()
            mins = match.group(2)
            secs = match.group(3)
            text = match.group(4).strip()

            if mins is not None and secs is not None:
                start = float(int(mins) * 60 + int(secs))
            elif secs is not None:
                start = float(secs)
            else:
                start = current_time

            end = start + max(4.0, len(text.split()) * 0.4)
            current_time = end
            segments.append({
                "speaker_name": speaker,
                "start_time": round(start, 1),
                "end_time": round(end, 1),
                "text": text
            })
        else:
            # Fallback line
            end = current_time + max(4.0, len(line.split()) * 0.4)
            segments.append({
                "speaker_name": "Speaker",
                "start_time": round(current_time, 1),
                "end_time": round(end, 1),
                "text": line
            })
            current_time = end

    return segments


def create_meeting(db: Session, meeting_in: schemas.MeetingCreate) -> models.Meeting:
    """Create a new meeting and auto-generate transcript segments/chapters if transcript provided."""
    db_meeting = models.Meeting(
        title=meeting_in.title,
        date=meeting_in.date,
        duration_seconds=meeting_in.duration_seconds or 0,
        participants=meeting_in.participants or "",
        audio_url=meeting_in.audio_url or "/sample-meeting.mp3",
        overview_summary=meeting_in.overview_summary or "Meeting notes and transcription generated."
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)

    total_duration = 0.0

    # Auto-parse raw transcript if supplied
    if meeting_in.raw_transcript:
        parsed_segments = parse_raw_transcript_lines(meeting_in.raw_transcript)
        for seg in parsed_segments:
            db_seg = models.TranscriptSegment(
                meeting_id=db_meeting.id,
                speaker_name=seg["speaker_name"],
                start_time=seg["start_time"],
                end_time=seg["end_time"],
                text=seg["text"]
            )
            db.add(db_seg)
            if seg["end_time"] > total_duration:
                total_duration = seg["end_time"]

        # If duration was 0, update from transcript
        if db_meeting.duration_seconds == 0 and total_duration > 0:
            db_meeting.duration_seconds = int(total_duration)

    # Add default summary chapter
    db_chapter = models.SummaryChapter(
        meeting_id=db_meeting.id,
        title="Discussion & Key Takeaways",
        start_time=0.0,
        summary_text=db_meeting.overview_summary,
        order=1
    )
    db.add(db_chapter)

    # Add custom or parsed action items
    if meeting_in.action_items_list:
        for item_text in meeting_in.action_items_list:
            if item_text.strip():
                db_action = models.ActionItem(
                    meeting_id=db_meeting.id,
                    text=item_text.strip(),
                    assignee="Team"
                )
                db.add(db_action)

    db.commit()
    db.refresh(db_meeting)
    return db_meeting


def update_meeting(db: Session, meeting_id: int, update_in: schemas.MeetingUpdate) -> Optional[models.Meeting]:
    """Update meeting metadata."""
    db_meeting = get_meeting(db, meeting_id)
    if not db_meeting:
        return None

    if update_in.title is not None:
        db_meeting.title = update_in.title
    if update_in.participants is not None:
        db_meeting.participants = update_in.participants
    if update_in.date is not None:
        db_meeting.date = update_in.date
    if update_in.overview_summary is not None:
        db_meeting.overview_summary = update_in.overview_summary

    db.commit()
    db.refresh(db_meeting)
    return db_meeting


def delete_meeting(db: Session, meeting_id: int) -> bool:
    """Delete meeting and all cascaded child records."""
    db_meeting = get_meeting(db, meeting_id)
    if not db_meeting:
        return False
    db.delete(db_meeting)
    db.commit()
    return True


# ---------------- Action Items CRUD ----------------
def create_action_item(db: Session, meeting_id: int, item_in: schemas.ActionItemCreate) -> models.ActionItem:
    """Add a new action item to a meeting."""
    db_item = models.ActionItem(
        meeting_id=meeting_id,
        text=item_in.text,
        assignee=item_in.assignee or "",
        is_completed=item_in.is_completed or False,
        due_date=item_in.due_date or ""
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_action_item(db: Session, item_id: int, update_in: schemas.ActionItemUpdate) -> Optional[models.ActionItem]:
    """Update action item status or details."""
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    if not db_item:
        return None

    if update_in.text is not None:
        db_item.text = update_in.text
    if update_in.assignee is not None:
        db_item.assignee = update_in.assignee
    if update_in.is_completed is not None:
        db_item.is_completed = update_in.is_completed
    if update_in.due_date is not None:
        db_item.due_date = update_in.due_date

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_action_item(db: Session, item_id: int) -> bool:
    """Delete an action item."""
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True


# ---------------- Comments & Bookmarks ----------------
def add_comment(db: Session, meeting_id: int, comment_in: schemas.CommentCreate) -> models.Comment:
    """Add a comment/soundbite note."""
    db_comment = models.Comment(
        meeting_id=meeting_id,
        segment_id=comment_in.segment_id,
        user_name=comment_in.user_name or "You",
        text=comment_in.text
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def toggle_bookmark_segment(db: Session, segment_id: int) -> Optional[models.TranscriptSegment]:
    """Bookmark/star a transcript segment."""
    segment = db.query(models.TranscriptSegment).filter(models.TranscriptSegment.id == segment_id).first()
    if not segment:
        return None
    segment.is_bookmarked = not segment.is_bookmarked
    db.commit()
    db.refresh(segment)
    return segment


# ---------------- Global Search ----------------
def global_search(db: Session, query_str: str) -> List[schemas.SearchResultItem]:
    """Search for a keyword across all transcript segments in all meetings."""
    if not query_str or len(query_str.strip()) < 2:
        return []

    search_fmt = f"%{query_str.strip()}%"
    segments = (
        db.query(models.TranscriptSegment, models.Meeting)
        .join(models.Meeting, models.TranscriptSegment.meeting_id == models.Meeting.id)
        .filter(models.TranscriptSegment.text.ilike(search_fmt))
        .limit(30)
        .all()
    )

    results = []
    for seg, meeting in segments:
        results.append(
            schemas.SearchResultItem(
                meeting_id=meeting.id,
                meeting_title=meeting.title,
                meeting_date=meeting.date,
                segment_id=seg.id,
                speaker_name=seg.speaker_name,
                start_time=seg.start_time,
                text=seg.text,
                matched_query=query_str
            )
        )
    return results
