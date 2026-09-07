# 🎙️ Fireflies.ai Clone — AI Meeting Notes & Transcription Platform

A fullstack web application clone of **Fireflies.ai** that replicates its modern design, user experience, and core meeting workflows: interactive transcription with two-way audio seeking, speaker diarization, AI-generated summary outlines, interactive action item management, global/in-transcript search, and "Ask AI" meeting assistance.

---

## 🏗️ Architecture Overview

```
Fireflies.ai Clone/
├── backend/                       # Python 3 + FastAPI + SQLite (SQLAlchemy ORM)
│   ├── main.py                    # App entry point, CORS, startup auto-seeding
│   ├── database.py                # SQLite engine & session dependency
│   ├── models.py                  # 5 Relational database models
│   ├── schemas.py                 # Pydantic request/response validation schemas
│   ├── crud.py                    # Concise, readable database query helpers
│   ├── seed_data.py               # 4 pre-seeded realistic multi-speaker meetings
│   ├── routers/
│   │   ├── meetings.py            # Meeting CRUD, search, and Markdown/TXT export
│   │   ├── action_items.py        # Action items checklist & segment bookmarks
│   │   └── ai_features.py         # "Ask Fred AI" assistant Q&A with cited timestamps
│   └── requirements.txt
│
└── frontend/                      # Next.js 14+ (TypeScript) + Tailwind CSS
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx         # Root layout with Sidebar and ThemeProvider
    │   │   ├── page.tsx           # Meetings Library & Dashboard view
    │   │   └── meetings/[id]/page.tsx # Interactive Meeting Detail & Audio Sync View
    │   ├── components/
    │   │   ├── layout/            # Sidebar, Navbar, PlaceholderModal
    │   │   ├── dashboard/         # MeetingCard, FilterBar, CreateMeetingModal, StatsOverview, GlobalSearchModal
    │   │   └── detail/            # AudioPlayer, TranscriptViewer, AiSummaryPanel, EditMeetingModal
    │   ├── context/
    │   │   └── ThemeContext.tsx   # Dark/Light mode theme state
    │   ├── lib/
    │   │   └── api.ts             # Clean, typed fetch API client
    │   └── types/
    │       └── index.ts           # TypeScript interfaces matching backend models
    └── package.json
```

---

## 🗄️ Database Schema (SQLite)

```
┌────────────────────────────────────────┐
│               MEETINGS                 │
├────────────────────────────────────────┤
│ id (PK)              INTEGER           │
│ title                VARCHAR(255)      │
│ date                 VARCHAR(50)       │
│ duration_seconds     INTEGER           │
│ participants         VARCHAR(500)      │
│ audio_url            VARCHAR(255)      │
│ overview_summary     TEXT              │
│ created_at           DATETIME          │
└──────────────────┬─────────────────────┘
                   │ 1:N
         ┌─────────┼─────────────────────────┬─────────────────────────┐
         ▼         ▼                         ▼                         ▼
┌──────────────────┐ ┌──────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐
│TRANSCRIPT_SEGMENT│ │     ACTION_ITEMS     │ │   SUMMARY_CHAPTERS    │ │      COMMENTS      │
├──────────────────┤ ├──────────────────────┤ ├───────────────────────┤ ├────────────────────┤
│ id (PK)          │ │ id (PK)              │ │ id (PK)               │ │ id (PK)            │
│ meeting_id (FK)  │ │ meeting_id (FK)      │ │ meeting_id (FK)       │ │ meeting_id (FK)    │
│ speaker_name     │ │ text                 │ │ title                 │ │ segment_id (FK/opt)│
│ speaker_avatar   │ │ assignee             │ │ start_time (Float)    │ │ user_name          │
│ start_time       │ │ is_completed (Bool)  │ │ summary_text          │ │ text               │
│ end_time         │ │ due_date             │ │ order (Int)           │ │ created_at         │
│ text             │ └──────────────────────┘ └───────────────────────┘ └────────────────────┘
│ is_bookmarked    │
└──────────────────┘
```

---

## ✨ Features Implemented

### 1. Meetings Library & Dashboard (`/`)
- **Visual Overview Cards**: Displays title, date, duration badge (e.g. `5m 15s`), speaker chips, action item counter (`X/Y Done`), and total lines.
- **Dynamic Stats Bar**: Real-time aggregation of total meetings, total minutes transcribed, task completion percentage, and active speakers.
- **Search, Filter & Sort**:
  - Substring search across titles, summaries, and participants.
  - Speaker filter chips to quickly isolate 1-on-1s or team syncs.
  - Sorting: *Newest First*, *Oldest First*, *Longest Duration*, *Shortest Duration*.
- **Quick Actions**: One-click deletion with confirmation dialog.

### 2. Interactive Meeting Detail & Synchronized Audio Player (`/meetings/[id]`)
- **Two-Way Audio-Transcript Synchronization**:
  - Clicking any transcript segment seeks audio directly to that exact second.
  - Playing the audio highlights the active speaker's segment in real-time.
- **Audio Controls**: HTML5 player with Play/Pause, Rewind 5s, Forward 5s, Scrub Progress Bar, Playback Speed (1x, 1.25x, 1.5x, 1.75x, 2x), and Volume/Mute controls.
- **Speaker Diarization Badges**: Distinct avatar badges and initials for every participant.
- **In-Transcript Keyword Search**: Highlights matching keywords with real-time match count.
- **Soundbites & Bookmarking**: Star important dialog moments.

### 3. AI Summary, Notes & Action Items
- **Executive Summary**: Overview of high-level discussion points.
- **Chapters & Outline**: Chronological topic breakdown with clickable timestamp chips that jump audio to that topic.
- **Interactive Action Items**: Checkbox toggle (persisted to SQLite), inline task creation with assignee tagging, and task deletion.
- **"Ask Fred AI" Meeting Assistant**: Interactive Q&A chat grounded directly on the transcript, returning concise answers with cited, clickable timestamp badges.
- **One-Click Export**: Download meeting notes as formatted **Markdown (`.md`)** or **Plain Text (`.txt`)**.

### 4. Meeting Creation & Management (CRUD)
- Create meetings via form, uploaded transcript file (`.txt`, `.json`), or pasted dialogue (`Speaker (MM:SS): text`).
- Edit meeting metadata (Title, Date, Participants).
- Delete meetings with cascade deletion of related child records.

### 5. Fireflies Look & Feel & Placeholders
- Sleek dark theme default with light theme toggle.
- Interactive placeholders for Live Meeting Bot (`fred@fireflies.ai`), CRM integrations, and Team sharing.
- Global search overlay (`⌘K`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v25 / v20)
- **Python**: 3.10+ (tested on Python 3.14 / 3.11)

### 1. Backend Setup (FastAPI + SQLite)
```bash
# Navigate to backend
cd backend

# Create virtual environment & activate
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server (auto-seeds sample database on first startup)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API: `http://localhost:8000`
* Interactive API Docs (Swagger): `http://localhost:8000/docs`

### 2. Frontend Setup (Next.js 14/15)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev -- -p 3000
```
* Open your browser at `http://localhost:3000`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meetings` | List meetings with `query`, `participant`, `sort_by` |
| `GET` | `/api/meetings/{id}` | Get complete meeting details with segments, chapters, and tasks |
| `POST` | `/api/meetings` | Create meeting (supports raw transcript auto-parsing) |
| `PATCH` | `/api/meetings/{id}` | Update meeting metadata (title, date, participants) |
| `DELETE` | `/api/meetings/{id}` | Delete meeting and cascade child records |
| `POST` | `/api/meetings/{id}/action-items` | Add new action item to a meeting |
| `PATCH` | `/api/action-items/{id}` | Toggle action item completed status |
| `DELETE` | `/api/action-items/{id}` | Delete an action item |
| `POST` | `/api/segments/{id}/bookmark` | Toggle star/bookmark on a soundbite segment |
| `POST` | `/api/meetings/{id}/ask-ai` | Ask Fred AI a question about the meeting |
| `GET` | `/api/search?q={query}` | Global search across all transcript segments |
| `GET` | `/api/meetings/{id}/export?format={md/txt}` | Download exported notes file |

---

## 🎯 Interview Quick-Answers & Code Walkthrough Guide

Use this section to confidently explain your code during an interview:

### Q1: How does the two-way audio-transcript synchronization work?
> **Answer**:  
> In `src/app/meetings/[id]/page.tsx`, we maintain a single `currentTime` state shared by `<AudioPlayer />` and `<TranscriptViewer />`.
> 1. **Audio -> Transcript**: As `<AudioPlayer />` plays, the native HTML5 `<audio>` element fires `onTimeUpdate`. The parent updates `currentTime`, and `<TranscriptViewer />` checks `segment.start_time <= currentTime <= segment.end_time` to highlight the active speaker card and optionally scroll it into view.
> 2. **Transcript -> Audio**: When the user clicks any transcript line, it invokes `onSeek(segment.start_time)`. The parent sets `currentTime`, which triggers a `useEffect` inside `<AudioPlayer />` that sets `audioRef.current.currentTime = newTime`.

### Q2: How does transcript parsing work when uploading or pasting raw text?
> **Answer**:  
> In `backend/crud.py`, the `parse_raw_transcript_lines()` function uses regular expressions (`^([^:]+?)(?:\s*\((?:(\d+):)?(\d+)\))?:\s*(.*)$`) to match dialogue in standard formats like `Sarah Chen (00:15): text` or `Alex: text`. It computes start/end timestamps and creates `TranscriptSegment` records in SQLite automatically.

### Q3: Why SQLite and SQLAlchemy for this architecture?
> **Answer**:  
> SQLite is zero-configuration, lightweight, and serverless, making it perfect for rapid local setup and offline persistence without spinning up external database containers. SQLAlchemy provides type-safe ORM models with `cascade="all, delete-orphan"` relationships for data integrity.

### Q4: How is search highlighting achieved without external libraries?
> **Answer**:  
> In `TranscriptViewer.tsx`, `renderHighlightedText()` splits the text using a regular expression created from the search query (`new RegExp(`(${query})`, "gi")`) and wraps matched tokens in `<mark className="bg-amber-400/30 ...">`.

---

## 📜 License
MIT License. Built as an SDE Fullstack Assignment.
