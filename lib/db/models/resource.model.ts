import mongoose from "mongoose";

export interface IResource extends mongoose.Document {
  title: string;
  type: "video" | "article" | "github" | "api" | "book" | "course";
  link: string;
  source: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const resourceSchema = new mongoose.Schema<IResource>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    type: {
      type: String,
      enum: ["video", "article", "github", "api", "book", "course"],
      required: true,
    },
    link: {
      type: String,
      required: [true, "Resource link is required"],
      validate: {
        validator: function (v: string) {
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            v
          );
        },
        message: "Please enter a valid URL",
      },
    },
    source: {
      type: String,
      required: [true, "Source is required"],
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Resource =
  mongoose.models.Resource ||
  mongoose.model<IResource>("Resource", resourceSchema);
