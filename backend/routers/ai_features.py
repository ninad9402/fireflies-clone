"""
AI Assistant router for Ask AI Q&A and transcript summarization.
Answers are intelligently extracted and grounded in the meeting transcript.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/api", tags=["AI Intelligence"])


@router.post("/meetings/{meeting_id}/ask-ai", response_model=schemas.AskAiResponse)
def ask_ai_about_meeting(
    meeting_id: int,
    request: schemas.AskAiRequest,
    db: Session = Depends(get_db)
):
    """
    Intelligent AI assistant that parses the meeting transcript to answer questions,
    cite timestamps, and attribute answers to specific speakers.
    """
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    question = request.question.strip().lower()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    keywords = [w for w in question.replace("?", "").replace(".", "").split() if len(w) > 2]
    matched_segments = []
    referenced_speakers = set()
    relevant_timestamps = []

    # Match relevant segments based on keywords
    for seg in meeting.segments:
        text_lower = seg.text.lower()
        speaker_lower = seg.speaker_name.lower()
        match_score = sum(1 for kw in keywords if kw in text_lower or kw in speaker_lower)

        if match_score > 0:
            matched_segments.append((match_score, seg))
            referenced_speakers.add(seg.speaker_name)
            relevant_timestamps.append(seg.start_time)

    # Sort matches by highest relevance
    matched_segments.sort(key=lambda x: x[0], reverse=True)

    if not matched_segments:
        # Generic meeting context answer
        return schemas.AskAiResponse(
            answer=f"Based on the transcript for '{meeting.title}', this topic was not explicitly discussed in detail. The meeting focused primarily on: {meeting.overview_summary[:200]}...",
            relevant_timestamps=[],
            referenced_speakers=list({s.speaker_name for s in meeting.segments[:2]})
        )

    # Construct contextual summary response
    top_segments = matched_segments[:3]
    answer_parts = []
    for _, seg in top_segments:
        mins = int(seg.start_time // 60)
        secs = int(seg.start_time % 60)
        answer_parts.append(
            f"At [{mins:02d}:{secs:02d}], **{seg.speaker_name}** stated: \"{seg.text}\""
        )

    answer_text = (
        f"Here is what was discussed regarding your question in '{meeting.title}':\n\n"
        + "\n\n".join(answer_parts)
    )

    return schemas.AskAiResponse(
        answer=answer_text,
        relevant_timestamps=relevant_timestamps[:4],
        referenced_speakers=list(referenced_speakers)
    )
