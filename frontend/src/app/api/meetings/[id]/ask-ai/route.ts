import { NextRequest, NextResponse } from "next/server";
import { getStoreMeetingById } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meeting = getStoreMeetingById(Number(id));
  if (!meeting) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }

  const { question } = await req.json();
  const q = (question || "").trim().toLowerCase();
  const keywords = q.replace(/[?.!]/g, "").split(" ").filter((w: string) => w.length > 2);

  const matchedSegments: { score: number; seg: any }[] = [];
  const referencedSpeakers = new Set<string>();
  const relevantTimestamps: number[] = [];

  for (const seg of meeting.segments) {
    const textLower = seg.text.toLowerCase();
    const speakerLower = seg.speaker_name.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (textLower.includes(kw) || speakerLower.includes(kw)) score++;
    }
    if (score > 0) {
      matchedSegments.push({ score, seg });
      referencedSpeakers.add(seg.speaker_name);
      relevantTimestamps.push(seg.start_time);
    }
  }

  matchedSegments.sort((a, b) => b.score - a.score);

  if (matchedSegments.length === 0) {
    return NextResponse.json({
      answer: `Based on "${meeting.title}", this topic was not explicitly discussed in detail. Overview: ${meeting.overview_summary.slice(0, 180)}...`,
      relevant_timestamps: [],
      referenced_speakers: meeting.segments.slice(0, 2).map((s) => s.speaker_name),
    });
  }

  const top = matchedSegments.slice(0, 3);
  const parts = top.map(({ seg }) => {
    const mins = Math.floor(seg.start_time / 60);
    const secs = Math.floor(seg.start_time % 60);
    const formatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `At [${formatted}], **${seg.speaker_name}** stated: "${seg.text}"`;
  });

  return NextResponse.json({
    answer: `Here is what was discussed in "${meeting.title}":\n\n` + parts.join("\n\n"),
    relevant_timestamps: relevantTimestamps.slice(0, 4),
    referenced_speakers: Array.from(referencedSpeakers),
  });
}
