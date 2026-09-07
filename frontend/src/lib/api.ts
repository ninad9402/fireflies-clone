/**
 * Minimal API Client for Fireflies.ai Clone
 * Connects Next.js frontend with FastAPI backend.
 */
import { MeetingListItem, MeetingDetail, SearchResultItem, AskAiResponse, ActionItem, TranscriptSegment } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function getMeetings(query?: string, participant?: string, sortBy: string = "newest"): Promise<MeetingListItem[]> {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (participant) params.append("participant", participant);
  if (sortBy) params.append("sort_by", sortBy);

  const res = await fetch(`${API_BASE}/meetings?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
}

export async function getMeetingDetail(id: number): Promise<MeetingDetail> {
  const res = await fetch(`${API_BASE}/meetings/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch meeting details");
  return res.json();
}

export async function createMeeting(data: {
  title: string;
  date: string;
  duration_seconds?: number;
  participants?: string;
  overview_summary?: string;
  raw_transcript?: string;
  action_items_list?: string[];
}): Promise<MeetingDetail> {
  const res = await fetch(`${API_BASE}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create meeting");
  return res.json();
}

export async function updateMeeting(id: number, data: { title?: string; participants?: string; date?: string }): Promise<MeetingDetail> {
  const res = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update meeting");
  return res.json();
}

export async function deleteMeeting(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/meetings/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete meeting");
  return true;
}

export async function createActionItem(meetingId: number, text: string, assignee?: string): Promise<ActionItem> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/action-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, assignee, is_completed: false }),
  });
  if (!res.ok) throw new Error("Failed to create action item");
  return res.json();
}

export async function updateActionItem(id: number, is_completed: boolean): Promise<ActionItem> {
  const res = await fetch(`${API_BASE}/action-items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_completed }),
  });
  if (!res.ok) throw new Error("Failed to update action item");
  return res.json();
}

export async function deleteActionItem(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/action-items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete action item");
  return true;
}

export async function toggleBookmark(segmentId: number): Promise<TranscriptSegment> {
  const res = await fetch(`${API_BASE}/segments/${segmentId}/bookmark`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to toggle bookmark");
  return res.json();
}

export async function globalSearch(query: string): Promise<SearchResultItem[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function askAiAssistant(meetingId: number, question: string): Promise<AskAiResponse> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/ask-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Failed to get AI answer");
  return res.json();
}

export function getExportDownloadUrl(meetingId: number, format: "markdown" | "txt"): string {
  return `${API_BASE}/meetings/${meetingId}/export?format=${format}`;
}
