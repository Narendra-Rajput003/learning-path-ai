import { Document, Schema, model, models } from "mongoose";


export interface IReview extends Document {
    user: Schema.Types.ObjectId;
    learningPath: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
}

const reviewSchema = new Schema<IReview>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    learningPath: {
        type: Schema.Types.ObjectId,
        ref: "LearningPath",
        required: [true, "LearningPath is required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be greater than or equal to 1"],
        max: [5, "Rating must be less than or equal to 5"],
    },
    comment: {
        type: String,
        required: [true, "Comment is required"],
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
}, { timestamps: true });

export const Review = models?.Review || model<IReview>("Review", reviewSchema);