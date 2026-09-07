"""
API router for Meeting CRUD, filtering, searching, and exports.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/api", tags=["Meetings"])


@router.get("/meetings", response_model=List[schemas.MeetingListItem])
def list_meetings(
    query: Optional[str] = Query(None, description="Search term for meeting title, participant, or summary"),
    participant: Optional[str] = Query(None, description="Filter by participant name"),
    sort_by: str = Query("newest", description="Sort order: newest, oldest, longest, shortest"),
    db: Session = Depends(get_db)
):
    """List all meetings with search, participant filter, and sorting."""
    return crud.get_meetings(db, query=query, participant=participant, sort_by=sort_by)


@router.get("/meetings/{meeting_id}", response_model=schemas.MeetingDetailResponse)
def get_meeting_detail(meeting_id: int, db: Session = Depends(get_db)):
    """Fetch full meeting detail with transcript segments, AI chapters, and action items."""
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.post("/meetings", response_model=schemas.MeetingDetailResponse, status_code=201)
def create_new_meeting(meeting_in: schemas.MeetingCreate, db: Session = Depends(get_db)):
    """Create a new meeting, automatically parsing pasted/uploaded transcript lines if provided."""
    return crud.create_meeting(db, meeting_in)


@router.patch("/meetings/{meeting_id}", response_model=schemas.MeetingDetailResponse)
def update_meeting_metadata(
    meeting_id: int,
    meeting_in: schemas.MeetingUpdate,
    db: Session = Depends(get_db)
):
    """Update meeting title, date, or participants."""
    updated = crud.update_meeting(db, meeting_id, meeting_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return updated


@router.delete("/meetings/{meeting_id}", status_code=204)
def delete_meeting_record(meeting_id: int, db: Session = Depends(get_db)):
    """Delete a meeting and all its associated transcripts and notes."""
    success = crud.delete_meeting(db, meeting_id)
    if not success:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return None


@router.get("/search", response_model=List[schemas.SearchResultItem])
def search_all_transcripts(
    q: str = Query(..., min_length=2, description="Query string to search across all meetings"),
    db: Session = Depends(get_db)
):
    """Global search across all transcript segments in all meetings."""
    return crud.global_search(db, q)


@router.get("/meetings/{meeting_id}/export")
def export_meeting_notes(
    meeting_id: int,
    format: str = Query("markdown", regex="^(markdown|txt)$"),
    db: Session = Depends(get_db)
):
    """Export meeting transcript and AI notes as Markdown or plain text download."""
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Format into structured text
    lines = [
        f"# {meeting.title}",
        f"**Date:** {meeting.date} | **Duration:** {meeting.duration_seconds // 60}m {meeting.duration_seconds % 60}s",
        f"**Participants:** {meeting.participants or 'None'}",
        "\n## Overview Summary",
        meeting.overview_summary or "No summary available.",
        "\n## Action Items"
    ]

    for item in meeting.action_items:
        status = "[x]" if item.is_completed else "[ ]"
        assignee = f" (@{item.assignee})" if item.assignee else ""
        lines.append(f"- {status} {item.text}{assignee}")

    lines.append("\n## Key Discussion Chapters")
    for chap in meeting.chapters:
        mins = int(chap.start_time // 60)
        secs = int(chap.start_time % 60)
        lines.append(f"### {chap.title} ({mins:02d}:{secs:02d})")
        lines.append(chap.summary_text)

    lines.append("\n## Full Transcript")
    for seg in meeting.segments:
        mins = int(seg.start_time // 60)
        secs = int(seg.start_time % 60)
        lines.append(f"**[{mins:02d}:{secs:02d}] {seg.speaker_name}:** {seg.text}")

    content = "\n\n".join(lines) if format == "markdown" else "\n".join(lines)
    filename = f"{meeting.title.replace(' ', '_').lower()}.{'md' if format == 'markdown' else 'txt'}"

    return Response(
        content=content,
        media_type="text/markdown" if format == "markdown" else "text/plain",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
