import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session';
import { handleError } from '@/lib/utils/error';
import { User } from '@/models/User';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
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