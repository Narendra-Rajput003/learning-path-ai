import { NextResponse } from 'next/server';
import { auth, currentUser } from "@clerk/nextjs/server";
import { Review } from '@/lib/db/models/review.model';
import connectDB from '@/lib/db/connect';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { rating, comment, roadmapTitle } = await req.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate comment
    if (!comment || comment.length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Create review with user details from Clerk
    const review = await Review.create({
      user: userId,
      userName: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.username || 'Anonymous',
      userImage: user.imageUrl || '',
      rating,
      comment,
      roadmapTitle,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('rating comment userName userImage createdAt'); // Removed roadmapTitle

    const total = await Review.countDocuments();

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: skip + reviews.length < total,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
