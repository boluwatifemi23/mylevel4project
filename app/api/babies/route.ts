import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/session';
import { AppError, handleError } from '@/lib/utils/error';
import { Baby } from '@/models/Baby';
import { z } from 'zod';

const babySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['male', 'female', 'other']),
  photo: z.string().url().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      throw new AppError(401, 'Not authenticated');
    }

    await connectDB();

    const babies = await Baby.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ babies });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      throw new AppError(401, 'Not authenticated');
    }

    await connectDB();

    const body = await request.json();
    const validatedData = babySchema.parse(body);

    const baby = await Baby.create({
      userId: session.userId,
      name: validatedData.name,
      birthDate: new Date(validatedData.birthDate),
      gender: validatedData.gender,
      photo: validatedData.photo,
      specialNeeds: {
        hasSpecialNeeds: false,
        conditions: [],
        notes: '',
      },
    });

    return NextResponse.json(
      {
        message: 'Baby profile created successfully',
        baby: {
          id: baby._id.toString(),
          name: baby.name,
          birthDate: baby.birthDate,
          gender: baby.gender,
          photo: baby.photo,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}