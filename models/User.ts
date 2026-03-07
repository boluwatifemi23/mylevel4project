import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profileType: 'parent' | 'expert' | 'brand';
  profile: {
    displayName: string;
    bio?: string;
    profileImage?: string;
    location?: string;
    kids?: Array<{
      name: string;
      birthYear: number;
      gender: string;
    }>;
  };
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileType: {
      type: String,
      enum: ['parent', 'expert', 'brand'],
      default: 'parent',
    },
    profile: {
      displayName: {
        type: String,
        required: true,
      },
      bio: String,
      profileImage: String,
      location: String,
      kids: [
        {
          name: String,
          birthYear: Number,
          gender: String,
        },
      ],
    },
    stats: {
      followers: {
        type: Number,
        default: 0,
      },
      following: {
        type: Number,
        default: 0,
      },
      posts: {
        type: Number,
        default: 0,
      },
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);