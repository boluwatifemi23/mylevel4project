import { deleteSession } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ message: 'Logout successful' });
  } catch {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}