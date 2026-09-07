"""
SQLAlchemy ORM models defining the relational schema for meetings,
transcripts, action items, chapters, and comments.
"""
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from database import Base


class Meeting(Base):
    """Represents a meeting entity containing transcripts, summaries, and action items."""
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    date = Column(String(50), nullable=False)
    duration_seconds = Column(Integer, default=0)
    participants = Column(String(500), default="")  # Comma-separated or JSON list
    audio_url = Column(String(255), default="/sample-meeting.mp3")
    overview_summary = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relational associations
    segments = relationship(
        "TranscriptSegment",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="TranscriptSegment.start_time"
    )
    action_items = relationship(
        "ActionItem",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="ActionItem.id"
    )
    chapters = relationship(
        "SummaryChapter",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="SummaryChapter.order"
    )
    comments = relationship(
        "Comment",
        back_populates="meeting",
        cascade="all, delete-orphan"
    )


class TranscriptSegment(Base):
    """Represents a time-stamped dialog segment uttered by a specific speaker."""
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    speaker_name = Column(String(100), nullable=False)
    speaker_avatar = Column(String(50), default="")
    start_time = Column(Float, nullable=False)  # in seconds
    end_time = Column(Float, nullable=False)    # in seconds
    text = Column(Text, nullable=False)
    is_bookmarked = Column(Boolean, default=False)

    meeting = relationship("Meeting", back_populates="segments")


class ActionItem(Base):
    """Represents a follow-up task extracted from the meeting."""
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    assignee = Column(String(100), default="")
    is_completed = Column(Boolean, default=False)
    due_date = Column(String(50), default="")

    meeting = relationship("Meeting", back_populates="action_items")


class SummaryChapter(Base):
    """Represents an AI-generated topic chapter with outline summary."""
    __tablename__ = "summary_chapters"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    start_time = Column(Float, default=0.0)
    summary_text = Column(Text, nullable=False)
    order = Column(Integer, default=0)

    meeting = relationship("Meeting", back_populates="chapters")


class Comment(Base):
    """User comment or soundbite note attached to a meeting/segment."""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    segment_id = Column(Integer, nullable=True)
    user_name = Column(String(100), default="You")
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    meeting = relationship("Meeting", back_populates="comments")
