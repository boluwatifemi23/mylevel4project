import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session';
import { AppError, handleError } from '@/lib/utils/error';
import { Follow } from '@/models/Follow';

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) throw new AppError(401, 'Not authenticated');

    const { userId } = await context.params;

    if (session.userId === userId) {
      return NextResponse.json({ following: false });
    }

    await connectDB();

    const existingFollow = await Follow.findOne({
      followerId: session.userId,
      followingId: userId,
    });

    return NextResponse.json({
      following: Boolean(existingFollow),
    });
  } catch (error) {
    return handleError(error);
  }
}