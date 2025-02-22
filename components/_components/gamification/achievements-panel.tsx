import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Star, Calendar } from "lucide-react";

interface AchievementsPanelProps {
  level: number;
  xp: number;
  streak: number;
  achievements: Array<{
    name: string;
    description: string;
    icon: string;
    dateEarned: Date;
  }>;
}

export function AchievementsPanel({ level, xp, streak, achievements }: AchievementsPanelProps) {
  const xpToNextLevel = level * 1000;
  const progress = (xp / xpToNextLevel) * 100;

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-sm text-muted-foreground">Level</div>
              <div className="font-bold">{level}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">XP</div>
              <div className="font-bold">{xp}/{xpToNextLevel}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-sm text-muted-foreground">Streak</div>
              <div className="font-bold">{streak} days</div>
            </div>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Achievements</h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="font-semibold">{achievement.name}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}