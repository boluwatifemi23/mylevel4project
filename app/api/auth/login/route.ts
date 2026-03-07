import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { comparePassword } from '@/lib/auth/password';
import { loginSchema } from '@/lib/utils/validation';
import { AppError, handleError } from '@/lib/utils/error';
import { User } from '@/models/User';
import { createSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const user = await User.findOne({ email: validatedData.email });

    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    await createSession(
      user._id.toString(),
      user.email,
      user.username
    );

    return NextResponse.json({
      message: 'Login successful',
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
