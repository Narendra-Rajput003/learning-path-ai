import { NextResponse } from 'next/server';
import { User } from '@/lib/db/models/user.model';
import connectDB from '@/lib/db/connect';
import { z } from 'zod';
import { Profile } from '@/lib/db/models/profile.model';
import { signupSchema } from '@/lib/db/schema/user.schema';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email }).select("-password")
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }


    const profileDetails = await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      ContactNumber:null,
    })

    // Create new user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      additionalDetails:profileDetails._id,
      password: validatedData.password,
      avatar:`https://api.dicebear.com/5.x/initials/svg?seed=${validatedData.name.charAt(0)}`
    });

    
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
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