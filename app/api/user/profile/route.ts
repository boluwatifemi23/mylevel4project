import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session'; // ✅ NEW
import { AppError, handleError } from '@/lib/utils/error';
import { User } from '@/models/User';
import { z } from 'zod';

const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  profileImage: z.string().url().optional().or(z.literal('')),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(); // ✅ CHANGED
    if (!session) throw new AppError(401, 'Not authenticated');

    await connectDB();

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const user = await User.findByIdAndUpdate(
      session.userId, // ✅ CHANGED
      {
        $set: {
          'profile.displayName': validatedData.displayName,
          'profile.bio': validatedData.bio || '',
          'profile.location': validatedData.location || '',
          'profile.profileImage': validatedData.profileImage || '',
        },
      },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileType: user.profileType,
        profile: user.profile,
        stats: user.stats,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}