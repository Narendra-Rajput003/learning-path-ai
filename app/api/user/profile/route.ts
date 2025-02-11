import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { User } from '@/lib/db/models/user.model';
import connectDB from '@/lib/db/connect';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio cannot be more than 500 characters').optional(),
  phoneNumber: z.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number').optional(),
  hobbies: z.array(z.string()).optional(),
  website: z.string().url('Invalid website URL').optional(),
  socialLinks: z.object({
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    github: z.string().url('Invalid GitHub URL').optional(),
    twitter: z.string().url('Invalid Twitter URL').optional()
  }).optional(),
  avatar: z.string().url('Invalid avatar URL').optional()
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select('-password')
      .populate('learningPaths');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}