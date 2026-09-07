/**
 * TypeScript Interfaces for Fireflies.ai Clone
 * Mirrors the backend SQLite / Pydantic models.
 */

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker_name: string;
  speaker_avatar?: string;
  start_time: number;
  end_time: number;
  text: string;
  is_bookmarked?: boolean;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee?: string;
  is_completed: boolean;
  due_date?: string;
}

export interface SummaryChapter {
  id: number;
  meeting_id: number;
  title: string;
  start_time: number;
  summary_text: string;
  order: number;
}

export interface Comment {
  id: number;
  meeting_id: number;
  segment_id?: number;
  user_name: string;
  text: string;
  created_at: string;
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: string;
  audio_url: string;
  overview_summary: string;
  created_at: string;
  action_items_count: number;
  completed_action_items_count: number;
  segments_count: number;
}

export interface MeetingDetail {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: string;
  audio_url: string;
  overview_summary: string;
  created_at: string;
  segments: TranscriptSegment[];
  action_items: ActionItem[];
  chapters: SummaryChapter[];
  comments: Comment[];
}

export interface SearchResultItem {
  meeting_id: number;
  meeting_title: string;
  meeting_date: string;
  segment_id: number;
  speaker_name: string;
  start_time: number;
  text: string;
  matched_query: string;
}

export interface AskAiResponse {
  answer: string;
  relevant_timestamps: number[];
  referenced_speakers: string[];
}
