
import { Document, Schema, model, models } from 'mongoose';


export interface IReview extends Document {
    user: Schema.Types.ObjectId
    learningPathTitle: string
    rating: number
    comment: string
    
  }
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learningPathTitle: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);



export const Review = models?.Review || model<IReview>("Review", reviewSchema);