import { NextRequest, NextResponse } from "next/server";
import { toggleStoreBookmark } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updated = toggleStoreBookmark(Number(id));
  if (!updated) {
    return NextResponse.json({ detail: "Segment not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
