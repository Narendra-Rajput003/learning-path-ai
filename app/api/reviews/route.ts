import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { Review } from '@/lib/db/models/review.model';
import connectDB from '@/lib/db/connect';

const reviewSchema = z.object({
  learningPathId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters long'),
});

export async function POST(req: Request) {
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
    const validatedData = reviewSchema.parse(body);

    const review = await Review.create({
      user: session.user.id,
      learningPath: validatedData.learningPathId,
      rating: validatedData.rating,
      comment: validatedData.comment
    });

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const reviews = await Review.find({ status: 'approved' })
      .populate('user', 'name')
      .populate('learningPath', 'title')
      .sort({ createdAt: -1 })
      .limit(6);

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}