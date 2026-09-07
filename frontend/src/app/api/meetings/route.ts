import { NextRequest, NextResponse } from "next/server";
import { getStoreMeetings, addStoreMeeting } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.toLowerCase();
  const participant = searchParams.get("participant")?.toLowerCase();
  const sortBy = searchParams.get("sort_by") || "newest";

  let list = getStoreMeetings().map((m) => ({
    id: m.id,
    title: m.title,
    date: m.date,
    duration_seconds: m.duration_seconds,
    participants: m.participants,
    audio_url: m.audio_url,
    overview_summary: m.overview_summary,
    created_at: m.created_at,
    action_items_count: m.action_items.length,
    completed_action_items_count: m.action_items.filter((a) => a.is_completed).length,
    segments_count: m.segments.length,
  }));

  if (query) {
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.participants.toLowerCase().includes(query) ||
        m.overview_summary.toLowerCase().includes(query)
    );
  }

  if (participant) {
    list = list.filter((m) => m.participants.toLowerCase().includes(participant));
  }

  if (sortBy === "oldest") {
    list.sort((a, b) => a.date.localeCompare(b.date));
  } else if (sortBy === "longest") {
    list.sort((a, b) => b.duration_seconds - a.duration_seconds);
  } else if (sortBy === "shortest") {
    list.sort((a, b) => a.duration_seconds - b.duration_seconds);
  } else {
    list.sort((a, b) => b.date.localeCompare(a.date));
  }

  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = addStoreMeeting(body);
  return NextResponse.json(created, { status: 201 });
}
