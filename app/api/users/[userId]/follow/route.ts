import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session';
import { AppError, handleError } from '@/lib/utils/error';
import { User } from '@/models/User';
import { Follow } from '@/models/Follow';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const session = await getSession();

    if (!session) throw new AppError(401, 'Not authenticated');

    await connectDB();

    if (session.userId === userId) {
      throw new AppError(400, 'Cannot follow yourself');
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      throw new AppError(404, 'User not found');
    }

    const existingFollow = await Follow.findOne({
      followerId: session.userId,
      followingId: userId,
    });

    let following = false;

    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });
      await User.findByIdAndUpdate(session.userId, {
        $inc: { 'stats.following': -1 },
      });
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.followers': -1 },
      });
      following = false;
    } else {
      await Follow.create({
        followerId: session.userId,
        followingId: userId,
      });
      await User.findByIdAndUpdate(session.userId, {
        $inc: { 'stats.following': 1 },
      });
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.followers': 1 },
      });
      following = true;
    }

    return NextResponse.json({ following });
  } catch (error) {
    return handleError(error);
  }
}