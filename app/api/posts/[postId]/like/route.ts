import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import mongoose from 'mongoose';
import { getSession } from '@/lib/auth/session';
import { AppError, handleError } from '@/lib/utils/error';
import { Post } from '@/models/Post';

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = mongoose.models.Like || mongoose.model('Like', LikeSchema);

export async function POST(
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

    const existingLike = await Like.findOne({
      userId: session.userId, 
    });

    let liked = false;

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      post.engagement.likes = Math.max(0, post.engagement.likes - 1);
      liked = false;
    } else {
      await Like.create({
        userId: session.userId, 
        postId: postId,
      });
      post.engagement.likes += 1;
      liked = true;
    }

    await post.save();

    return NextResponse.json({
      liked,
      likes: post.engagement.likes,
    });
  } catch (error) {
    return handleError(error);
  }
}