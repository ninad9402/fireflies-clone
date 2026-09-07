"""
Seeding script with rich, realistic multi-speaker meeting data,
exact timestamps, AI chapters, action items, and overview summaries.
"""
from sqlalchemy.orm import Session
import models
from database import SessionLocal, engine, Base


SEED_MEETINGS = [
    {
        "title": "Q3 AI Roadmap & LLM Search Architecture",
        "date": "2026-09-05",
        "duration_seconds": 315,
        "participants": "Sarah Chen, Alex Rivera, Maya Patel, David Kim",
        "audio_url": "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
        "overview_summary": "The team reviewed Q3 milestones focusing on low-latency vector search, real-time audio-transcript synchronization, and AI action item auto-extraction. Alex presented the SQLite + vector index benchmarks showing 3x throughput improvement. Maya confirmed frontend UI parity with Fireflies design standards.",
        "chapters": [
            {
                "title": "1. Welcome & Q3 Objective Alignment",
                "start_time": 0.0,
                "summary_text": "Sarah opened the sync reviewing key metrics and Q3 deliverables. Focus is on delivering an ultra-fast meeting notes experience.",
                "order": 1
            },
            {
                "title": "2. Vector Search Architecture & Latency",
                "start_time": 45.0,
                "summary_text": "Alex outlined backend query optimizations reducing transcript indexing time to under 120ms.",
                "order": 2
            },
            {
                "title": "3. Interactive Transcript & Audio Sync",
                "start_time": 120.0,
                "summary_text": "Maya showcased the two-way audio scrubber syncing with active speaker cards in Next.js.",
                "order": 3
            },
            {
                "title": "4. Action Items & Release Schedule",
                "start_time": 210.0,
                "summary_text": "Team agreed to freeze core features by Thursday and conduct load testing before Friday staging deploy.",
                "order": 4
            }
        ],
        "action_items": [
            {"text": "Benchmark vector search latency under 500 concurrent queries", "assignee": "Alex Rivera", "is_completed": True, "due_date": "Sep 09"},
            {"text": "Finalize two-way audio scrubber & transcript auto-scroll animation", "assignee": "Maya Patel", "is_completed": False, "due_date": "Sep 10"},
            {"text": "Draft release documentation and API endpoint schema specs", "assignee": "David Kim", "is_completed": False, "due_date": "Sep 11"},
            {"text": "Coordinate staging deployment and QA sign-off", "assignee": "Sarah Chen", "is_completed": False, "due_date": "Sep 12"}
        ],
        "segments": [
            {"speaker_name": "Sarah Chen", "start_time": 0.0, "end_time": 12.0, "text": "Good morning everyone. Thanks for jumping on. Today we're aligning our Q3 engineering roadmap for the AI transcription and search engine."},
            {"speaker_name": "Alex Rivera", "start_time": 12.5, "end_time": 28.0, "text": "Morning Sarah. I have the updated benchmark numbers ready. We tested the new indexing pipeline on 50 hours of audio transcripts and saw a 3x speedup."},
            {"speaker_name": "Maya Patel", "start_time": 28.5, "end_time": 44.0, "text": "That's huge Alex! On the frontend side, we connected the timestamp events directly to the HTML5 audio state, so clicking any sentence seeks instantaneously."},
            {"speaker_name": "Sarah Chen", "start_time": 45.0, "end_time": 62.0, "text": "Fantastic. Alex, can you walk us through the vector search architecture and how we're handling cross-meeting search queries?"},
            {"speaker_name": "Alex Rivera", "start_time": 62.5, "end_time": 88.0, "text": "Sure thing. Each transcript sentence is stored with its exact start and end timestamps. When a user runs a global search, we query both exact substring matches and semantic embeddings."},
            {"speaker_name": "David Kim", "start_time": 88.5, "end_time": 110.0, "text": "From a data integrity perspective, keeping SQLite lightweight with indexed foreign keys ensures our API response time stays well below 30 milliseconds."},
            {"speaker_name": "Maya Patel", "start_time": 110.5, "end_time": 135.0, "text": "And the UX feels very crisp. We added speaker badge color palettes, keyword highlight counters, and a clean soundbite bookmarking option."},
            {"speaker_name": "Sarah Chen", "start_time": 135.5, "end_time": 160.0, "text": "What about the AI summary and action item extraction? Are the generated tasks accurate?"},
            {"speaker_name": "Alex Rivera", "start_time": 160.5, "end_time": 188.0, "text": "Yes, we prompt the model with speaker diarization context so it accurately attributes each action item to the person who committed to it."},
            {"speaker_name": "David Kim", "start_time": 188.5, "end_time": 210.0, "text": "I'll make sure our test suite validates both single-speaker and multi-speaker edge cases before the Thursday code freeze."},
            {"speaker_name": "Sarah Chen", "start_time": 210.5, "end_time": 235.0, "text": "Awesome progress team. Let's wrap up with our key commitments and reconvene on Friday for the final staging review. Have a great day!"}
        ]
    },
    {
        "title": "Frontend Engineering Sprint Review & Design System",
        "date": "2026-09-04",
        "duration_seconds": 240,
        "participants": "Maya Patel, Jordan Lee, Chris Evans",
        "audio_url": "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
        "overview_summary": "Sprint review covering the Next.js component library, dark/light theme switching, responsive sidebar navigation, and accessibility standards for keyboard-driven transcript navigation.",
        "chapters": [
            {
                "title": "1. Sprint Goals Check-in",
                "start_time": 0.0,
                "summary_text": "Maya reviewed completed sprint tickets including modal transitions and theme toggling.",
                "order": 1
            },
            {
                "title": "2. Transcript Keyboard Accessibility",
                "start_time": 60.0,
                "summary_text": "Jordan demonstrated Spacebar to toggle playback and Arrow keys to jump ±5 seconds.",
                "order": 2
            },
            {
                "title": "3. Design Polish & Fireflies Aesthetics",
                "start_time": 140.0,
                "summary_text": "Chris reviewed color tokens, border radiuses, and glassmorphic card elevations.",
                "order": 3
            }
        ],
        "action_items": [
            {"text": "Add keyboard shortcut tooltip helper modal (Space, J, K, L)", "assignee": "Jordan Lee", "is_completed": True, "due_date": "Sep 07"},
            {"text": "Audit color contrast for dark mode badge tags", "assignee": "Chris Evans", "is_completed": False, "due_date": "Sep 08"},
            {"text": "Test mobile responsiveness on tablet and phone viewports", "assignee": "Maya Patel", "is_completed": False, "due_date": "Sep 09"}
        ],
        "segments": [
            {"speaker_name": "Maya Patel", "start_time": 0.0, "end_time": 15.0, "text": "Welcome everyone to our sprint demo. Jordan, would you like to share your screen and show the keyboard navigation features?"},
            {"speaker_name": "Jordan Lee", "start_time": 15.5, "end_time": 35.0, "text": "Sure! Users can now hit Space to play or pause the audio player from anywhere on the transcript view without losing focus."},
            {"speaker_name": "Chris Evans", "start_time": 35.5, "end_time": 55.0, "text": "I love how smooth the active line tracking is. The subtle indigo highlight border makes it very clear which speaker is currently talking."},
            {"speaker_name": "Maya Patel", "start_time": 55.5, "end_time": 80.0, "text": "Let's ensure we also have clean export options so users can take their notes into Notion or Markdown files with one click."},
            {"speaker_name": "Jordan Lee", "start_time": 80.5, "end_time": 105.0, "text": "Already built! We have Markdown and plain text export endpoints configured on the backend that download clean formatted text files."}
        ]
    },
    {
        "title": "Enterprise Client Discovery — Acme Health Corp",
        "date": "2026-09-02",
        "duration_seconds": 290,
        "participants": "Rachel Zhang, Sarah Chen, Thomas Miller",
        "audio_url": "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
        "overview_summary": "Discovery call with Acme Health CTO Thomas Miller regarding HIPAA-compliant audio retention, automated meeting notes for clinical staff, and CRM integration workflows.",
        "chapters": [
            {
                "title": "1. Customer Requirements Overview",
                "start_time": 0.0,
                "summary_text": "Thomas shared that their 200+ team needs automated summaries of weekly syncs.",
                "order": 1
            },
            {
                "title": "2. Security & Data Retention",
                "start_time": 75.0,
                "summary_text": "Sarah explained local on-premise SQLite options and encrypted rest/transit architectures.",
                "order": 2
            },
            {
                "title": "3. Next Steps & Enterprise Pilot",
                "start_time": 160.0,
                "summary_text": "Agreed to start a 14-day sandbox pilot with 20 clinical directors.",
                "order": 3
            }
        ],
        "action_items": [
            {"text": "Send Acme Corp security whitepaper and data architecture doc", "assignee": "Rachel Zhang", "is_completed": True, "due_date": "Sep 04"},
            {"text": "Provision pilot sandbox environment for 20 seats", "assignee": "Sarah Chen", "is_completed": False, "due_date": "Sep 08"},
            {"text": "Schedule technical kickoff call with Thomas's DevOps lead", "assignee": "Rachel Zhang", "is_completed": False, "due_date": "Sep 10"}
        ],
        "segments": [
            {"speaker_name": "Rachel Zhang", "start_time": 0.0, "end_time": 14.0, "text": "Hi Thomas, wonderful to meet you. Thanks for sharing your team's background ahead of this call."},
            {"speaker_name": "Thomas Miller", "start_time": 14.5, "end_time": 38.0, "text": "Great to connect Rachel and Sarah. We run around 80 syncs every week across cardiology and administrative teams. Capturing clear action items automatically is our top priority."},
            {"speaker_name": "Sarah Chen", "start_time": 38.5, "end_time": 65.0, "text": "That matches our core platform capability. Our AI automatically extracts tasks, assigns them to participants mentioned in the call, and builds a chronological topic outline."},
            {"speaker_name": "Thomas Miller", "start_time": 65.5, "end_time": 90.0, "text": "How easy is it for a user to search for a specific discussion point across meetings that took place two weeks ago?"},
            {"speaker_name": "Sarah Chen", "start_time": 90.5, "end_time": 115.0, "text": "Our global search scans every spoken word across all meetings in under 50 milliseconds, allowing you to jump straight into the exact audio timestamp."}
        ]
    },
    {
        "title": "Design System & Soundbite Audio Player UX Sync",
        "date": "2026-08-30",
        "duration_seconds": 180,
        "participants": "Chris Evans, Maya Patel, Elena Rostova",
        "audio_url": "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
        "overview_summary": "Design review of the audio playback controls, playback speed selector (1x, 1.25x, 1.5x, 2x), and soundbite clip sharing interface.",
        "chapters": [
            {
                "title": "1. Audio Bar Component Specs",
                "start_time": 0.0,
                "summary_text": "Reviewed responsive layout of play/pause, scrub progress bar, and speed menu.",
                "order": 1
            },
            {
                "title": "2. Soundbite Creation Flow",
                "start_time": 80.0,
                "summary_text": "Discussed one-click snippet sharing and transcript bookmarking.",
                "order": 2
            }
        ],
        "action_items": [
            {"text": "Refine playback speed dropdown selector UI", "assignee": "Chris Evans", "is_completed": True, "due_date": "Sep 02"},
            {"text": "Validate mobile touch scrub behavior on iOS Safari", "assignee": "Elena Rostova", "is_completed": True, "due_date": "Sep 03"}
        ],
        "segments": [
            {"speaker_name": "Chris Evans", "start_time": 0.0, "end_time": 18.0, "text": "Let's review the audio player floating bar. We want it docked at the top or bottom of the meeting view with easy speed controls."},
            {"speaker_name": "Maya Patel", "start_time": 18.5, "end_time": 42.0, "text": "I set up the speed toggles for 1x, 1.25x, 1.5x, and 2x. Changing speed instantly updates the playbackRate property on the audio element."},
            {"speaker_name": "Elena Rostova", "start_time": 42.5, "end_time": 68.0, "text": "I ran QA tests on Chrome and Safari; the transcript auto-scroll stays perfectly synchronized even at 2x speed."}
        ]
    }
]


def seed_database(db: Session = None):
    """Populate SQLite database with realistic seed meetings if currently empty."""
    close_after = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_after = True

    try:
        existing_count = db.query(models.Meeting).count()
        if existing_count > 0:
            print(f"[Seed] Database already contains {existing_count} meetings. Skipping seed.")
            return

        print("[Seed] Seeding database with realistic Fireflies.ai meeting records...")
        for m_data in SEED_MEETINGS:
            meeting = models.Meeting(
                title=m_data["title"],
                date=m_data["date"],
                duration_seconds=m_data["duration_seconds"],
                participants=m_data["participants"],
                audio_url=m_data["audio_url"],
                overview_summary=m_data["overview_summary"]
            )
            db.add(meeting)
            db.commit()
            db.refresh(meeting)

            # Add chapters
            for chap in m_data.get("chapters", []):
                db_chap = models.SummaryChapter(
                    meeting_id=meeting.id,
                    title=chap["title"],
                    start_time=chap["start_time"],
                    summary_text=chap["summary_text"],
                    order=chap["order"]
                )
                db.add(db_chap)

            # Add action items
            for act in m_data.get("action_items", []):
                db_act = models.ActionItem(
                    meeting_id=meeting.id,
                    text=act["text"],
                    assignee=act["assignee"],
                    is_completed=act.get("is_completed", False),
                    due_date=act.get("due_date", "")
                )
                db.add(db_act)

            # Add transcript segments
            for seg in m_data.get("segments", []):
                db_seg = models.TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker_name=seg["speaker_name"],
                    start_time=seg["start_time"],
                    end_time=seg["end_time"],
                    text=seg["text"]
                )
                db.add(db_seg)

            db.commit()

        print(f"[Seed] Successfully seeded {len(SEED_MEETINGS)} meetings!")
    finally:
        if close_after:
            db.close()


if __name__ == "__main__":
    seed_database()
