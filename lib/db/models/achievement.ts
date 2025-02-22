import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  type: {
    type: String,
    enum: ['STREAK', 'COMPLETION', 'QUIZ', 'MILESTONE'],
    required: true
  },
  requirement: { type: Number, required: true },
  xpReward: { type: Number, required: true }
});

export const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);