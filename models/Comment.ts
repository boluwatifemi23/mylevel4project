import mongoose, { Schema, Model } from 'mongoose';

export interface IComment {
  _id: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  parentCommentId?: mongoose.Types.ObjectId;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ postId: 1, createdAt: -1 });

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);