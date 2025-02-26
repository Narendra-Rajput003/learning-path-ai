
import { Document, Schema, model, models } from 'mongoose';

export interface IReview extends Document {
  user: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = models.Review || model<IReview>('Review', reviewSchema);
