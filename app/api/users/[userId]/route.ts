import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

import { AppError, handleError } from '@/lib/utils/error';
import { User } from '@/models/User';
import { Post } from '@/models/Post';



export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const user = await User.findById(params.userId).select('-password').lean();

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const posts = await Post.find({ authorId: params.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      user,
      posts,
    });
  } catch (error) {
    return handleError(error);
  }
}