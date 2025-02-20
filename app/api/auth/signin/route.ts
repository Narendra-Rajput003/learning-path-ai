import { NextResponse } from 'next/server';
import { User } from '@/lib/db/models/user.model';
import connectDB from '@/lib/db/connect';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { signinSchema } from '@/lib/db/schema/user.schema';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = signinSchema.parse(body);

    // Find user and include password for comparison
    const user = await User.findOne({ email: validatedData.email })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    return NextResponse.json({
      message: 'Signed in successfully',
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}