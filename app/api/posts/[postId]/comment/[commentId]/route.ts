import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session'; // ✅ NEW
import { AppError, handleError } from '@/lib/utils/error';
import { Comment } from '@/models/Comment';
import { Post } from '@/models/Post';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const { postId, commentId } = await context.params;
    const session = await getSession(); 
    
    if (!session) throw new AppError(401, 'Not authenticated');

    await connectDB();

    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      throw new AppError(404, 'Comment not found');
    }

    if (comment.authorId.toString() !== session.userId) {
      throw new AppError(403, 'Not authorized to delete this comment');
    }

    await Comment.findByIdAndDelete(commentId);
    await Comment.deleteMany({ parentCommentId: commentId });

    await Post.findByIdAndUpdate(postId, {
      $inc: { 'engagement.comments': -1 },
    });

    return NextResponse.json({
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}