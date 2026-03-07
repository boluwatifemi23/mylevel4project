import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session'; 
import { AppError, handleError } from '@/lib/utils/error';
import { Post } from '@/models/Post';
import { User } from '@/models/User';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    await connectDB();

    const post = await Post.findById(postId)
      .populate('authorId', 'username profile.displayName profile.profileImage')
      .lean();

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    return NextResponse.json({ post });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const session = await getSession(); 
    
    if (!session) throw new AppError(401, 'Not authenticated');

    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    if (post.authorId.toString() !== session.userId) { 
      throw new AppError(403, 'Not authorized to delete this post');
    }

    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(session.userId, { 
      $inc: { 'stats.posts': -1 },
    });

    return NextResponse.json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const session = await getSession(); 
    
    if (!session) throw new AppError(401, 'Not authenticated');

    await connectDB();

    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    if (post.authorId.toString() !== session.userId) { 
      throw new AppError(403, 'Not authorized to update this post');
    }

    const body = await request.json();
    const { content } = body;

    post.content = content;
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('authorId', 'username profile.displayName profile.profileImage')
      .lean();

    return NextResponse.json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    return handleError(error);
  }
}