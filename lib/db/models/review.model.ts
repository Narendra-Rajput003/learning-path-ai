
import { Document, Schema, model, models } from 'mongoose';

export interface IReview extends Document {
  user: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  roadmapTitle?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  roadmapTitle: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = models.Review || model<IReview>('Review', reviewSchema);
