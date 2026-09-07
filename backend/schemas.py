"""
Pydantic schemas for data validation and API serialization.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------- Transcript Segment Schemas ----------------
class TranscriptSegmentBase(BaseModel):
    speaker_name: str
    speaker_avatar: Optional[str] = ""
    start_time: float
    end_time: float
    text: str
    is_bookmarked: Optional[bool] = False


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True


# ---------------- Action Item Schemas ----------------
class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = ""
    is_completed: Optional[bool] = False
    due_date: Optional[str] = ""


class ActionItemCreate(ActionItemBase):
    pass


class ActionItemUpdate(BaseModel):
    text: Optional[str] = None
    assignee: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[str] = None


class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True


# ---------------- Summary Chapter Schemas ----------------
class SummaryChapterBase(BaseModel):
    title: str
    start_time: float = 0.0
    summary_text: str
    order: Optional[int] = 0


class SummaryChapterCreate(SummaryChapterBase):
    pass


class SummaryChapterResponse(SummaryChapterBase):
    id: int
    meeting_id: int

    class Config:
        from_attributes = True


# ---------------- Comment Schemas ----------------
class CommentBase(BaseModel):
    text: str
    user_name: Optional[str] = "You"
    segment_id: Optional[int] = None


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    id: int
    meeting_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------- Meeting Schemas ----------------
class MeetingBase(BaseModel):
    title: str
    date: str
    duration_seconds: Optional[int] = 0
    participants: Optional[str] = ""
    audio_url: Optional[str] = "/sample-meeting.mp3"
    overview_summary: Optional[str] = ""


class MeetingCreate(MeetingBase):
    raw_transcript: Optional[str] = Field(
        None,
        description="Optional raw text transcript (e.g. 'Sarah: Hello\\nAlex: Hi') to auto-parse"
    )
    action_items_list: Optional[List[str]] = Field(
        None,
        description="Optional list of action item strings to create"
    )


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    participants: Optional[str] = None
    date: Optional[str] = None
    overview_summary: Optional[str] = None


class MeetingListItem(MeetingBase):
    id: int
    created_at: datetime
    action_items_count: int = 0
    completed_action_items_count: int = 0
    segments_count: int = 0

    class Config:
        from_attributes = True


class MeetingDetailResponse(MeetingBase):
    id: int
    created_at: datetime
    segments: List[TranscriptSegmentResponse] = []
    action_items: List[ActionItemResponse] = []
    chapters: List[SummaryChapterResponse] = []
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True


# ---------------- AI & Search Schemas ----------------
class AskAiRequest(BaseModel):
    question: str


class AskAiResponse(BaseModel):
    answer: str
    relevant_timestamps: List[float] = []
    referenced_speakers: List[str] = []


class SearchResultItem(BaseModel):
    meeting_id: int
    meeting_title: str
    meeting_date: str
    segment_id: int
    speaker_name: str
    start_time: float
    text: str
    matched_query: str
