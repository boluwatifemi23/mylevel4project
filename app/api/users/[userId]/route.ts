import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { AppError, handleError } from '@/lib/utils/error';
import { User } from '@/models/User';
import { Post } from '@/models/Post';

export async function GET(
  _: Request,
  context: { params: Promise<{ userId: string }> }  // ✅ Promise
) {
  try {
    const { userId } = await context.params;  // ✅ await

    await connectDB();

    const user = await User.findById(userId).select('-password').lean();

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ user, posts });
  } catch (error) {
    return handleError(error);
  }
}