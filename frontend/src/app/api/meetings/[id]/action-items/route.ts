import { NextRequest, NextResponse } from "next/server";
import { addStoreActionItem } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const created = addStoreActionItem(Number(id), body.text, body.assignee);
  if (!created) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json(created, { status: 201 });
}
