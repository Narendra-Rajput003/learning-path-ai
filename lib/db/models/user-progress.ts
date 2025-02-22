import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLoginDate: { type: Date },
  completedTopics: [{ type: String }],
  achievements: [{
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    dateEarned: { type: Date, default: Date.now }
  }],
  quizScores: [{
    topicId: { type: String },
    score: { type: Number },
    dateTaken: { type: Date }
  }]
});

export const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);