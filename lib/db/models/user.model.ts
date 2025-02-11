import { Types, Document, Schema, models, model } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  phoneNumber?: string;
  hobbies?: string[];
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
  };
  learningPaths: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email",
    ],
  },
  avatar: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    maxlength: [128, "Password must be less than 128 characters long"],
  },
  bio: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    match: [/^\d{10}$/, "Invalid phone number"],
  },
  hobbies: [
    {
      type: String,
      default: "",
    },
  ],
  socialLinks: {
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
  },
  learningPaths: [
    {
      type: Schema.Types.ObjectId,
      ref: "LearningPath",
    },
  ],
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcryptjs.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

export const User = models?.User || model<IUser>("User", userSchema);