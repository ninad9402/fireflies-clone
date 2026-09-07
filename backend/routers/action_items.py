"""
API router for Action items, segment bookmarking, and comments.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/api", tags=["Action Items & Notes"])


@router.post("/meetings/{meeting_id}/action-items", response_model=schemas.ActionItemResponse, status_code=201)
def add_action_item(
    meeting_id: int,
    item_in: schemas.ActionItemCreate,
    db: Session = Depends(get_db)
):
    """Add a new action item to a specific meeting."""
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return crud.create_action_item(db, meeting_id, item_in)


@router.patch("/action-items/{item_id}", response_model=schemas.ActionItemResponse)
def update_action_item_status(
    item_id: int,
    update_in: schemas.ActionItemUpdate,
    db: Session = Depends(get_db)
):
    """Update action item text, assignee, or toggle completion."""
    updated = crud.update_action_item(db, item_id, update_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Action item not found")
    return updated


@router.delete("/action-items/{item_id}", status_code=204)
def remove_action_item(item_id: int, db: Session = Depends(get_db)):
    """Delete an action item."""
    success = crud.delete_action_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Action item not found")
    return None


@router.post("/segments/{segment_id}/bookmark", response_model=schemas.TranscriptSegmentResponse)
def toggle_segment_bookmark(segment_id: int, db: Session = Depends(get_db)):
    """Star / bookmark a soundbite segment."""
    segment = crud.toggle_bookmark_segment(db, segment_id)
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    return segment


@router.post("/meetings/{meeting_id}/comments", response_model=schemas.CommentResponse, status_code=201)
def add_meeting_comment(
    meeting_id: int,
    comment_in: schemas.CommentCreate,
    db: Session = Depends(get_db)
):
    """Post a comment or note to the meeting."""
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return crud.add_comment(db, meeting_id, comment_in)
