import { NextRequest, NextResponse } from "next/server";
import { globalSearchStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const results = globalSearchStore(q);
  return NextResponse.json(results);
}
