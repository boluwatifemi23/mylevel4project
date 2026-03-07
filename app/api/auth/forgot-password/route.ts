import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { generateResetToken } from '@/lib/auth/password';
import { forgotPasswordSchema } from '@/lib/utils/validation';
import { sendEmail, emailTemplates } from '@/lib/email/nodemailer';

import { handleError } from '@/lib/utils/error';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    const user = await User.findOne({ email: validatedData.email });

    if (!user) {
     
      return NextResponse.json({
        message: 'If an account exists, a password reset email has been sent',
      });
    }

    
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

   
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  
    const resetTemplate = emailTemplates.passwordReset(resetUrl, user.profile.displayName);
    await sendEmail({
      to: user.email,
      subject: resetTemplate.subject,
      html: resetTemplate.html,
      text: resetTemplate.text,
    });

    return NextResponse.json({
      message: 'If an account exists, a password reset email has been sent',
    });
  } catch (error) {
    return handleError(error);
  }
}