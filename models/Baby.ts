import mongoose, { Schema, Model } from 'mongoose';

export interface IBaby {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  photo?: string;
  specialNeeds: {
    hasSpecialNeeds: boolean;
    conditions?: string[];
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BabySchema = new Schema<IBaby>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    photo: String,
    specialNeeds: {
      hasSpecialNeeds: {
        type: Boolean,
        default: false,
      },
      conditions: [String],
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Baby: Model<IBaby> =
  mongoose.models.Baby || mongoose.model<IBaby>('Baby', BabySchema);