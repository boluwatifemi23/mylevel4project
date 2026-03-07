
import { getSession } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { handleError } from '@/lib/utils/error';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

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
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      profileType: user.profileType,
      profile: user.profile,
      stats: user.stats,
    });
  } catch (error) {
    return handleError(error);
  }
}