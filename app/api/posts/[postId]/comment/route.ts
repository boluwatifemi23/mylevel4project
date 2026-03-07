import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session';
import { z } from 'zod';
import { AppError, handleError } from '@/lib/utils/error';
import { Comment } from '@/models/Comment';
import { Post } from '@/models/Post';

const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  parentCommentId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    await connectDB();

    const comments = await Comment.find({
      postId: postId,
      parentCommentId: { $exists: false },
    })
      .sort({ createdAt: -1 })
      .populate('authorId', 'username profile.displayName profile.profileImage')
      .lean();

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentCommentId: comment._id,
        })
          .sort({ createdAt: 1 })
          .populate('authorId', 'username profile.displayName profile.profileImage')
          .lean();

        return {
          ...comment,
          replies,
        };
      })
    );

    return NextResponse.json({ comments: commentsWithReplies });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const session = await getSession(); 
    if (!session) throw new AppError(401, 'Not authenticated');

    await connectDB();

    const body = await request.json();
    const validatedData = commentSchema.parse(body);

    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    const comment = await Comment.create({
      postId: postId,
      authorId: session.userId,
      content: validatedData.content,
      parentCommentId: validatedData.parentCommentId,
    });

    post.engagement.comments += 1;
    await post.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId', 'username profile.displayName profile.profileImage')
      .lean();

    return NextResponse.json(
      {
        message: 'Comment created successfully',
        comment: populatedComment,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}