import { NextRequest, NextResponse } from "next/server";
import { updateStoreActionItem, deleteStoreActionItem } from "@/lib/store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateStoreActionItem(Number(id), body.is_completed);
  if (!updated) {
    return NextResponse.json({ detail: "Action item not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteStoreActionItem(Number(id));
  if (!success) {
    return NextResponse.json({ detail: "Action item not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
