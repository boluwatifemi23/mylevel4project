import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session'; 
import { createPostSchema } from '@/lib/utils/validation';
import { AppError, handleError } from '@/lib/utils/error';
import { Post } from '@/models/Post';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const posts = await Post.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'username profile.displayName profile.profileImage')
      .lean();

    const total = await Post.countDocuments({ visibility: 'public' });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(); 
    if (!session) throw new AppError(401, 'Not authenticated');

    await connectDB();

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    const post = await Post.create({
      authorId: session.userId, 
      ...validatedData,
    });

    await User.findByIdAndUpdate(session.userId, { 
      $inc: { 'stats.posts': 1 },
    });

    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'username profile.displayName profile.profileImage')
      .lean();

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post: populatedPost,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}