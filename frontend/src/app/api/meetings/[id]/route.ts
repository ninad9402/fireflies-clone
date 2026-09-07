import { NextRequest, NextResponse } from "next/server";
import { getStoreMeetingById, updateStoreMeeting, deleteStoreMeeting } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meeting = getStoreMeetingById(Number(id));
  if (!meeting) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json(meeting);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateStoreMeeting(Number(id), body);
  if (!updated) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteStoreMeeting(Number(id));
  if (!success) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
