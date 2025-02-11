import { Schema, Document, model, models } from "mongoose";

export interface ILearningPath extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  steps: {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    resources: Schema.Types.ObjectId[];
    status: 'pending' | 'in-progress' | 'completed';
  }[];
}

const learningPathSchema = new Schema<ILearningPath>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  steps: [
    {
      title: {
        type: String,
        required: [true, "Title is required"],
      },
      description: {
        type: String,
        required: [true, "Description is required"],
      },
      difficulty: {
        type: String,
        required: [true, "Difficulty is required"],
        enum: ['beginner', 'intermediate', 'advanced']
      },
      resources: [
        {
          type: Schema.Types.ObjectId,
          ref: "Resource",
        },
      ],
      status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
      },
    },
  ],
}, { timestamps: true });

export const LearningPath = models?.LearningPath || model<ILearningPath>("LearningPath", learningPathSchema);