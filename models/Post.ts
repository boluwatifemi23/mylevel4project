import mongoose, { Schema, Model } from 'mongoose';

export interface IPost {
  _id: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  type: 'milestone' | 'update' | 'question' | 'review';
  content: string;
  images?: string[];
  videos?: string[];
  hashtags?: string[];
  mentions?: mongoose.Types.ObjectId[];
  groupId?: mongoose.Types.ObjectId;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    likesBy: string[];
  };
  visibility: 'public' | 'followers' | 'group' | 'private';
  milestoneData?: {
    babyName: string;
    ageMonths: number;
    category: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['milestone', 'update', 'question', 'review'],
      default: 'update',
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    images: [String],
    videos: [String],
    hashtags: [String],
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    engagement: {
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      }, 
      shares: {
        type: Number,
        default: 0,
      },
      saves: {
        type: Number,
        default: 0,
      },
    },
    visibility: {
      type: String,
      enum: ['public', 'followers', 'group', 'private'],
      default: 'public',
    },
    milestoneData: {
      babyName: String,
      ageMonths: Number,
      category: String,
    },
  },
  {
    timestamps: true,
  }
);


PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ hashtags: 1 });
PostSchema.index({ createdAt: -1 });

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);