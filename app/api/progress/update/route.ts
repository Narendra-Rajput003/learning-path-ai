import { NextResponse } from 'next/server';
import { UserProgress } from '@/lib/db/models/user-progress';
import { Achievement } from '@/lib/db/models/achievement';

export async function POST(req: Request) {
  try {
    const { userId, action, data } = await req.json();
    const userProgress = await UserProgress.findOne({ userId });

    switch (action) {
      case 'COMPLETE_QUIZ':
        const xpGained = data.score * 100;
        userProgress.xp += xpGained;
        userProgress.quizScores.push({
          topicId: data.topicId,
          score: data.score,
          dateTaken: new Date()
        });
        
        // Check for level up
        const xpForNextLevel = userProgress.level * 1000;
        if (userProgress.xp >= xpForNextLevel) {
          userProgress.level += 1;
          // Check for level-based achievements
          const levelAchievements = await Achievement.find({
            type: 'MILESTONE',
            requirement: userProgress.level
          });
          userProgress.achievements.push(...levelAchievements.map(a => ({
            achievementId: a._id,
            dateEarned: new Date()
          })));
        }
        break;

      case 'UPDATE_STREAK':
        const lastLogin = new Date(userProgress.lastLoginDate);
        const today = new Date();
        const dayDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          userProgress.streak += 1;
          // Check for streak achievements
          const streakAchievements = await Achievement.find({
            type: 'STREAK',
            requirement: { $lte: userProgress.streak }
          });
          userProgress.achievements.push(...streakAchievements.map(a => ({
            achievementId: a._id,
            dateEarned: new Date()
          })));
        } else if (dayDiff > 1) {
          userProgress.streak = 1;
        }
        userProgress.lastLoginDate = today;
        break;
    }

    await userProgress.save();
    return NextResponse.json({ success: true, userProgress });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}