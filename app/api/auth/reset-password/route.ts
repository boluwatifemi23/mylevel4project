import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { hashPassword } from '@/lib/auth/password';
import { resetPasswordSchema } from '@/lib/utils/validation';

import { AppError, handleError } from '@/lib/utils/error';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
try {
await connectDB();
const body = await request.json();
const validatedData = resetPasswordSchema.parse(body);

const user = await User.findOne({
  resetPasswordToken: validatedData.token,
  resetPasswordExpires: { $gt: new Date() },
});

if (!user) {
  throw new AppError(400, 'Invalid or expired reset token');
}


const hashedPassword = await hashPassword(validatedData.password);

user.password = hashedPassword;
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save();

return NextResponse.json({
  message: 'Password reset successful',
}); 
} catch (error) {
return handleError(error);
}
}