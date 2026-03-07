import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/utils/validation";
import { sendEmail, emailTemplates } from "@/lib/email/nodemailer";
import { AppError, handleError } from "@/lib/utils/error";
import { User } from "@/models/User";
import { createSession } from "@/lib/auth/session"; 

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    const existingUser = await User.findOne({
      $or: [
        { email: validatedData.email },
        { username: validatedData.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === validatedData.email) {
        throw new AppError(400, "Email already registered");
      }
      throw new AppError(400, "Username already taken");
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const user = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      password: hashedPassword,
      profileType: validatedData.profileType,

      profile: {
        displayName: validatedData.displayName,
        bio: "",
        profileImage: "",
        location: "",
        kids: [],
      },

      stats: {
        followers: 0,
        following: 0,
        posts: 0,
      },

      emailVerified: false,
    });

    await createSession(
      user._id.toString(),
      user.email,
      user.username
    );

    const welcomeTemplate = emailTemplates.welcomeEmail(
      user.profile.displayName
    );

    await sendEmail({
      to: user.email,
      subject: welcomeTemplate.subject,
      html: welcomeTemplate.html,
      text: welcomeTemplate.text,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileType: user.profileType,
          profile: user.profile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

