import { NextResponse } from 'next/server';
import  {useUser} from "@clerk/nextjs";
import { Review } from '@/lib/db/models/review.model';
import connectDB from '@/lib/db/connect';

export async function POST(req: Request) {
  try {
    const { user} = useUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { rating, comment } = await req.json();

    const review = await Review.create({
      user: user.id,
      rating,
      comment,
      createdAt: new Date(),
    });

    await review.populate('user', 'name image');

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
      .populate('user', 'name image');

    const total = await Review.countDocuments();

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: skip + reviews.length < total,
      },
    });
  } catch (error) {
    console.error('Review fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
