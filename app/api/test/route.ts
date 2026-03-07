import { connectDB } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
