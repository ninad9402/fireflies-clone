/**
 * Serverless In-Memory & Seed Data Store for Vercel Deployment.
 * Guarantees zero-config instant deployment on Vercel with all sample data.
 */
import { MeetingDetail, TranscriptSegment, ActionItem, SummaryChapter, SearchResultItem } from "@/types";

export interface ServerMeeting extends MeetingDetail {}

const INITIAL_SEED: ServerMeeting[] = [
  {
    id: 1,
    title: "Q3 AI Roadmap & LLM Search Architecture",
    date: "2026-09-05",
    duration_seconds: 315,
    participants: "Sarah Chen, Alex Rivera, Maya Patel, David Kim",
    audio_url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    overview_summary: "The team reviewed Q3 milestones focusing on low-latency vector search, real-time audio-transcript synchronization, and AI action item auto-extraction. Alex presented the SQLite + vector index benchmarks showing 3x throughput improvement. Maya confirmed frontend UI parity with Fireflies design standards.",
    created_at: new Date().toISOString(),
    chapters: [
      {
        id: 1,
        meeting_id: 1,
        title: "1. Welcome & Q3 Objective Alignment",
        start_time: 0.0,
        summary_text: "Sarah opened the sync reviewing key metrics and Q3 deliverables. Focus is on delivering an ultra-fast meeting notes experience.",
        order: 1
      },
      {
        id: 2,
        meeting_id: 1,
        title: "2. Vector Search Architecture & Latency",
        start_time: 45.0,
        summary_text: "Alex outlined backend query optimizations reducing transcript indexing time to under 120ms.",
        order: 2
      },
      {
        id: 3,
        meeting_id: 1,
        title: "3. Interactive Transcript & Audio Sync",
        start_time: 120.0,
        summary_text: "Maya showcased the two-way audio scrubber syncing with active speaker cards in Next.js.",
        order: 3
      },
      {
        id: 4,
        meeting_id: 1,
        title: "4. Action Items & Release Schedule",
        start_time: 210.0,
        summary_text: "Team agreed to freeze core features by Thursday and conduct load testing before Friday staging deploy.",
        order: 4
      }
    ],
    action_items: [
      { id: 1, meeting_id: 1, text: "Benchmark vector search latency under 500 concurrent queries", assignee: "Alex Rivera", is_completed: true, due_date: "Sep 09" },
      { id: 2, meeting_id: 1, text: "Finalize two-way audio scrubber & transcript auto-scroll animation", assignee: "Maya Patel", is_completed: false, due_date: "Sep 10" },
      { id: 3, meeting_id: 1, text: "Draft release documentation and API endpoint schema specs", assignee: "David Kim", is_completed: false, due_date: "Sep 11" },
      { id: 4, meeting_id: 1, text: "Coordinate staging deployment and QA sign-off", assignee: "Sarah Chen", is_completed: false, due_date: "Sep 12" }
    ],
    segments: [
      { id: 1, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 0.0, end_time: 12.0, text: "Good morning everyone. Thanks for jumping on. Today we're aligning our Q3 engineering roadmap for the AI transcription and search engine.", is_bookmarked: false },
      { id: 2, meeting_id: 1, speaker_name: "Alex Rivera", start_time: 12.5, end_time: 28.0, text: "Morning Sarah. I have the updated benchmark numbers ready. We tested the new indexing pipeline on 50 hours of audio transcripts and saw a 3x speedup.", is_bookmarked: false },
      { id: 3, meeting_id: 1, speaker_name: "Maya Patel", start_time: 28.5, end_time: 44.0, text: "That's huge Alex! On the frontend side, we connected the timestamp events directly to the HTML5 audio state, so clicking any sentence seeks instantaneously.", is_bookmarked: false },
      { id: 4, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 45.0, end_time: 62.0, text: "Fantastic. Alex, can you walk us through the vector search architecture and how we're handling cross-meeting search queries?", is_bookmarked: false },
      { id: 5, meeting_id: 1, speaker_name: "Alex Rivera", start_time: 62.5, end_time: 88.0, text: "Sure thing. Each transcript sentence is stored with its exact start and end timestamps. When a user runs a global search, we query both exact substring matches and semantic embeddings.", is_bookmarked: false },
      { id: 6, meeting_id: 1, speaker_name: "David Kim", start_time: 88.5, end_time: 110.0, text: "From a data integrity perspective, keeping SQLite lightweight with indexed foreign keys ensures our API response time stays well below 30 milliseconds.", is_bookmarked: false },
      { id: 7, meeting_id: 1, speaker_name: "Maya Patel", start_time: 110.5, end_time: 135.0, text: "And the UX feels very crisp. We added speaker badge color palettes, keyword highlight counters, and a clean soundbite bookmarking option.", is_bookmarked: false },
      { id: 8, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 135.5, end_time: 160.0, text: "What about the AI summary and action item extraction? Are the generated tasks accurate?", is_bookmarked: false },
      { id: 9, meeting_id: 1, speaker_name: "Alex Rivera", start_time: 160.5, end_time: 188.0, text: "Yes, we prompt the model with speaker diarization context so it accurately attributes each action item to the person who committed to it.", is_bookmarked: false },
      { id: 10, meeting_id: 1, speaker_name: "David Kim", start_time: 188.5, end_time: 210.0, text: "I'll make sure our test suite validates both single-speaker and multi-speaker edge cases before the Thursday code freeze.", is_bookmarked: false },
      { id: 11, meeting_id: 1, speaker_name: "Sarah Chen", start_time: 210.5, end_time: 235.0, text: "Awesome progress team. Let's wrap up with our key commitments and reconvene on Friday for the final staging review. Have a great day!", is_bookmarked: false }
    ],
    comments: []
  },
  {
    id: 2,
    title: "Frontend Engineering Sprint Review & Design System",
    date: "2026-09-04",
    duration_seconds: 240,
    participants: "Maya Patel, Jordan Lee, Chris Evans",
    audio_url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    overview_summary: "Sprint review covering the Next.js component library, dark/light theme switching, responsive sidebar navigation, and accessibility standards for keyboard-driven transcript navigation.",
    created_at: new Date().toISOString(),
    chapters: [
      { id: 5, meeting_id: 2, title: "1. Sprint Goals Check-in", start_time: 0.0, summary_text: "Maya reviewed completed sprint tickets including modal transitions and theme toggling.", order: 1 },
      { id: 6, meeting_id: 2, title: "2. Transcript Keyboard Accessibility", start_time: 60.0, summary_text: "Jordan demonstrated Spacebar to toggle playback and Arrow keys to jump ±5 seconds.", order: 2 },
      { id: 7, meeting_id: 2, title: "3. Design Polish & Fireflies Aesthetics", start_time: 140.0, summary_text: "Chris reviewed color tokens, border radiuses, and glassmorphic card elevations.", order: 3 }
    ],
    action_items: [
      { id: 5, meeting_id: 2, text: "Add keyboard shortcut tooltip helper modal (Space, J, K, L)", assignee: "Jordan Lee", is_completed: true, due_date: "Sep 07" },
      { id: 6, meeting_id: 2, text: "Audit color contrast for dark mode badge tags", assignee: "Chris Evans", is_completed: false, due_date: "Sep 08" },
      { id: 7, meeting_id: 2, text: "Test mobile responsiveness on tablet and phone viewports", assignee: "Maya Patel", is_completed: false, due_date: "Sep 09" }
    ],
    segments: [
      { id: 12, meeting_id: 2, speaker_name: "Maya Patel", start_time: 0.0, end_time: 15.0, text: "Welcome everyone to our sprint demo. Jordan, would you like to share your screen and show the keyboard navigation features?", is_bookmarked: false },
      { id: 13, meeting_id: 2, speaker_name: "Jordan Lee", start_time: 15.5, end_time: 35.0, text: "Sure! Users can now hit Space to play or pause the audio player from anywhere on the transcript view without losing focus.", is_bookmarked: false },
      { id: 14, meeting_id: 2, speaker_name: "Chris Evans", start_time: 35.5, end_time: 55.0, text: "I love how smooth the active line tracking is. The subtle highlight border makes it very clear which speaker is currently talking.", is_bookmarked: false },
      { id: 15, meeting_id: 2, speaker_name: "Maya Patel", start_time: 55.5, end_time: 80.0, text: "Let's ensure we also have clean export options so users can take their notes into Notion or Markdown files with one click.", is_bookmarked: false },
      { id: 16, meeting_id: 2, speaker_name: "Jordan Lee", start_time: 80.5, end_time: 105.0, text: "Already built! We have Markdown and plain text export endpoints configured on the backend that download clean formatted text files.", is_bookmarked: false }
    ],
    comments: []
  },
  {
    id: 3,
    title: "Enterprise Client Discovery — Acme Health Corp",
    date: "2026-09-02",
    duration_seconds: 290,
    participants: "Rachel Zhang, Sarah Chen, Thomas Miller",
    audio_url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    overview_summary: "Discovery call with Acme Health CTO Thomas Miller regarding HIPAA-compliant audio retention, automated meeting notes for clinical staff, and CRM integration workflows.",
    created_at: new Date().toISOString(),
    chapters: [
      { id: 8, meeting_id: 3, title: "1. Customer Requirements Overview", start_time: 0.0, summary_text: "Thomas shared that their 200+ team needs automated summaries of weekly syncs.", order: 1 },
      { id: 9, meeting_id: 3, title: "2. Security & Data Retention", start_time: 75.0, summary_text: "Sarah explained local on-premise SQLite options and encrypted rest/transit architectures.", order: 2 },
      { id: 10, meeting_id: 3, title: "3. Next Steps & Enterprise Pilot", start_time: 160.0, summary_text: "Agreed to start a 14-day sandbox pilot with 20 clinical directors.", order: 3 }
    ],
    action_items: [
      { id: 8, meeting_id: 3, text: "Send Acme Corp security whitepaper and data architecture doc", assignee: "Rachel Zhang", is_completed: true, due_date: "Sep 04" },
      { id: 9, meeting_id: 3, text: "Provision pilot sandbox environment for 20 seats", assignee: "Sarah Chen", is_completed: false, due_date: "Sep 08" },
      { id: 10, meeting_id: 3, text: "Schedule technical kickoff call with Thomas's DevOps lead", assignee: "Rachel Zhang", is_completed: false, due_date: "Sep 10" }
    ],
    segments: [
      { id: 17, meeting_id: 3, speaker_name: "Rachel Zhang", start_time: 0.0, end_time: 14.0, text: "Hi Thomas, wonderful to meet you. Thanks for sharing your team's background ahead of this call.", is_bookmarked: false },
      { id: 18, meeting_id: 3, speaker_name: "Thomas Miller", start_time: 14.5, end_time: 38.0, text: "Great to connect Rachel and Sarah. We run around 80 syncs every week across cardiology and administrative teams. Capturing clear action items automatically is our top priority.", is_bookmarked: false },
      { id: 19, meeting_id: 3, speaker_name: "Sarah Chen", start_time: 38.5, end_time: 65.0, text: "That matches our core platform capability. Our AI automatically extracts tasks, assigns them to participants mentioned in the call, and builds a chronological topic outline.", is_bookmarked: false },
      { id: 20, meeting_id: 3, speaker_name: "Thomas Miller", start_time: 65.5, end_time: 90.0, text: "How easy is it for a user to search for a specific discussion point across meetings that took place two weeks ago?", is_bookmarked: false },
      { id: 21, meeting_id: 3, speaker_name: "Sarah Chen", start_time: 90.5, end_time: 115.0, text: "Our global search scans every spoken word across all meetings in under 50 milliseconds, allowing you to jump straight into the exact audio timestamp.", is_bookmarked: false }
    ],
    comments: []
  },
  {
    id: 4,
    title: "Design System & Soundbite Audio Player UX Sync",
    date: "2026-08-30",
    duration_seconds: 180,
    participants: "Chris Evans, Maya Patel, Elena Rostova",
    audio_url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    overview_summary: "Design review of the audio playback controls, playback speed selector (1x, 1.25x, 1.5x, 2x), and soundbite clip sharing interface.",
    created_at: new Date().toISOString(),
    chapters: [
      { id: 11, meeting_id: 4, title: "1. Audio Bar Component Specs", start_time: 0.0, summary_text: "Reviewed responsive layout of play/pause, scrub progress bar, and speed menu.", order: 1 },
      { id: 12, meeting_id: 4, title: "2. Soundbite Creation Flow", start_time: 80.0, summary_text: "Discussed one-click snippet sharing and transcript bookmarking.", order: 2 }
    ],
    action_items: [
      { id: 11, meeting_id: 4, text: "Refine playback speed dropdown selector UI", assignee: "Chris Evans", is_completed: true, due_date: "Sep 02" },
      { id: 12, meeting_id: 4, text: "Validate mobile touch scrub behavior on iOS Safari", assignee: "Elena Rostova", is_completed: true, due_date: "Sep 03" }
    ],
    segments: [
      { id: 22, meeting_id: 4, speaker_name: "Chris Evans", start_time: 0.0, end_time: 18.0, text: "Let's review the audio player floating bar. We want it docked at the top or bottom of the meeting view with easy speed controls.", is_bookmarked: false },
      { id: 23, meeting_id: 4, speaker_name: "Maya Patel", start_time: 18.5, end_time: 42.0, text: "I set up the speed toggles for 1x, 1.25x, 1.5x, and 2x. Changing speed instantly updates the playbackRate property on the audio element.", is_bookmarked: false },
      { id: 24, meeting_id: 4, speaker_name: "Elena Rostova", start_time: 42.5, end_time: 68.0, text: "I ran QA tests on Chrome and Safari; the transcript auto-scroll stays perfectly synchronized even at 2x speed.", is_bookmarked: false }
    ],
    comments: []
  }
];

// In-memory data holder
let meetingsStore: ServerMeeting[] = [...INITIAL_SEED];
let nextMeetingId = 5;
let nextActionId = 20;
let nextSegmentId = 30;

export function getStoreMeetings() {
  return meetingsStore;
}

export function getStoreMeetingById(id: number) {
  return meetingsStore.find((m) => m.id === id);
}

export function addStoreMeeting(meeting: Omit<ServerMeeting, "id" | "created_at" | "segments" | "action_items" | "chapters" | "comments"> & {
  raw_transcript?: string;
  action_items_list?: string[];
}) {
  const newId = nextMeetingId++;
  const segments: TranscriptSegment[] = [];

  if (meeting.raw_transcript) {
    const lines = meeting.raw_transcript.split("\n").filter((l) => l.trim());
    let curTime = 0.0;
    lines.forEach((line) => {
      const match = line.match(/^([^:]+?)(?:\s*\((?:(\d+):)?(\d+)\))?:\s*(.*)$/);
      if (match) {
        const speaker = match[1].trim();
        const mins = match[2];
        const secs = match[3];
        const text = match[4].trim();
        const start = mins !== undefined && secs !== undefined ? parseInt(mins) * 60 + parseInt(secs) : curTime;
        const end = start + Math.max(4.0, text.split(" ").length * 0.4);
        curTime = end;
        segments.push({
          id: nextSegmentId++,
          meeting_id: newId,
          speaker_name: speaker,
          start_time: Math.round(start * 10) / 10,
          end_time: Math.round(end * 10) / 10,
          text
        });
      } else {
        const end = curTime + 4.0;
        segments.push({
          id: nextSegmentId++,
          meeting_id: newId,
          speaker_name: "Speaker",
          start_time: curTime,
          end_time: end,
          text: line
        });
        curTime = end;
      }
    });
  }

  const actionItems: ActionItem[] = (meeting.action_items_list || []).map((t) => ({
    id: nextActionId++,
    meeting_id: newId,
    text: t,
    assignee: "Team",
    is_completed: false
  }));

  const newMeeting: ServerMeeting = {
    id: newId,
    title: meeting.title,
    date: meeting.date,
    duration_seconds: meeting.duration_seconds || 180,
    participants: meeting.participants || "",
    audio_url: meeting.audio_url || "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    overview_summary: meeting.overview_summary || "Meeting transcript and notes generated.",
    created_at: new Date().toISOString(),
    segments,
    action_items: actionItems,
    chapters: [
      {
        id: newId,
        meeting_id: newId,
        title: "Discussion & Takeaways",
        start_time: 0.0,
        summary_text: meeting.overview_summary || "Meeting discussion outline.",
        order: 1
      }
    ],
    comments: []
  };

  meetingsStore.unshift(newMeeting);
  return newMeeting;
}

export function updateStoreMeeting(id: number, data: Partial<ServerMeeting>) {
  const idx = meetingsStore.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  meetingsStore[idx] = { ...meetingsStore[idx], ...data };
  return meetingsStore[idx];
}

export function deleteStoreMeeting(id: number) {
  const initialLen = meetingsStore.length;
  meetingsStore = meetingsStore.filter((m) => m.id !== id);
  return meetingsStore.length < initialLen;
}

export function addStoreActionItem(meetingId: number, text: string, assignee?: string) {
  const meeting = getStoreMeetingById(meetingId);
  if (!meeting) return null;
  const newItem: ActionItem = {
    id: nextActionId++,
    meeting_id: meetingId,
    text,
    assignee: assignee || "",
    is_completed: false
  };
  meeting.action_items.push(newItem);
  return newItem;
}

export function updateStoreActionItem(itemId: number, is_completed: boolean) {
  for (const m of meetingsStore) {
    const item = m.action_items.find((a) => a.id === itemId);
    if (item) {
      item.is_completed = is_completed;
      return item;
    }
  }
  return null;
}

export function deleteStoreActionItem(itemId: number) {
  for (const m of meetingsStore) {
    const idx = m.action_items.findIndex((a) => a.id === itemId);
    if (idx !== -1) {
      m.action_items.splice(idx, 1);
      return true;
    }
  }
  return false;
}

export function toggleStoreBookmark(segmentId: number) {
  for (const m of meetingsStore) {
    const seg = m.segments.find((s) => s.id === segmentId);
    if (seg) {
      seg.is_bookmarked = !seg.is_bookmarked;
      return seg;
    }
  }
  return null;
}

export function globalSearchStore(query: string): SearchResultItem[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results: SearchResultItem[] = [];

  for (const m of meetingsStore) {
    for (const seg of m.segments) {
      if (seg.text.toLowerCase().includes(q) || seg.speaker_name.toLowerCase().includes(q)) {
        results.push({
          meeting_id: m.id,
          meeting_title: m.title,
          meeting_date: m.date,
          segment_id: seg.id,
          speaker_name: seg.speaker_name,
          start_time: seg.start_time,
          text: seg.text,
          matched_query: query
        });
      }
    }
  }
  return results.slice(0, 30);
}
