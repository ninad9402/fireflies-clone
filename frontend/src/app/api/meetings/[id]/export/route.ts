import { NextRequest, NextResponse } from "next/server";
import { getStoreMeetingById } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "markdown";

  const meeting = getStoreMeetingById(Number(id));
  if (!meeting) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }

  const lines = [
    `# ${meeting.title}`,
    `**Date:** ${meeting.date} | **Duration:** ${Math.floor(meeting.duration_seconds / 60)}m ${meeting.duration_seconds % 60}s`,
    `**Participants:** ${meeting.participants || "None"}`,
    "\n## Overview Summary",
    meeting.overview_summary || "No summary available.",
    "\n## Action Items"
  ];

  for (const item of meeting.action_items) {
    const status = item.is_completed ? "[x]" : "[ ]";
    const assignee = item.assignee ? ` (@${item.assignee})` : "";
    lines.push(`- ${status} ${item.text}${assignee}`);
  }

  lines.push("\n## Key Discussion Chapters");
  for (const chap of meeting.chapters) {
    const mins = Math.floor(chap.start_time / 60);
    const secs = Math.floor(chap.start_time % 60);
    lines.push(`### ${chap.title} (${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")})`);
    lines.push(chap.summary_text);
  }

  lines.push("\n## Full Transcript");
  for (const seg of meeting.segments) {
    const mins = Math.floor(seg.start_time / 60);
    const secs = Math.floor(seg.start_time % 60);
    lines.push(`**[${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}] ${seg.speaker_name}:** ${seg.text}`);
  }

  const content = format === "markdown" ? lines.join("\n\n") : lines.join("\n");
  const filename = `${meeting.title.replace(/\s+/g, "_").toLowerCase()}.${format === "markdown" ? "md" : "txt"}`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": format === "markdown" ? "text/markdown" : "text/plain",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
