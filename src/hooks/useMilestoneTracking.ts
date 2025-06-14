
import { useEffect } from 'react';
import { toast } from 'sonner';

const MILESTONE_MESSAGES = [
  "🎉 Amazing! You've made 10 comments! Keep the momentum going!",
  "🚀 Fantastic! 20 comments completed! You're on fire!",
  "⭐ Incredible! 25 comments done! You're a commenting superstar!",
  "🏆 Outstanding! 30 comments achieved! Your engagement is impressive!",
  "🎯 Phenomenal! 40 comments completed! You're crushing your goals!",
  "💫 Spectacular! 50 comments reached! You're an engagement champion!",
  "🌟 Legendary! 60 comments done! Your consistency is remarkable!",
  "🔥 Unstoppable! 70 comments completed! You're in the zone!",
  "💎 Exceptional! 80 comments achieved! You're a true professional!",
  "👑 Magnificent! 90 comments done! You're nearly at 100!",
  "🎊 INCREDIBLE! 100 comments completed! You're a commenting master!"
];

const getMilestoneMessage = (count: number): string => {
  const milestoneIndex = Math.floor(count / 10) - 1;
  if (milestoneIndex < MILESTONE_MESSAGES.length) {
    return MILESTONE_MESSAGES[milestoneIndex];
  }
  // For counts beyond 100, generate dynamic messages
  return `🌟 Amazing! You've completed ${count} comments! Your dedication is inspiring!`;
};

const isMilestone = (count: number): boolean => {
  return count > 0 && (count % 10 === 0 || count === 25 || count === 35 || count === 45);
};

export const useMilestoneTracking = (currentCount: number, dailyTarget: number = 20) => {
  useEffect(() => {
    if (isMilestone(currentCount)) {
      const message = getMilestoneMessage(currentCount);
      const progressPercentage = Math.round((currentCount / dailyTarget) * 100);
      
      toast.success(message, {
        description: `Daily progress: ${currentCount}/${dailyTarget} comments (${progressPercentage}%)`,
        duration: 5000,
      });
    }
  }, [currentCount, dailyTarget]);

  const getProgressInfo = () => ({
    current: currentCount,
    target: dailyTarget,
    percentage: Math.round((currentCount / dailyTarget) * 100),
    remaining: Math.max(0, dailyTarget - currentCount),
    isTargetReached: currentCount >= dailyTarget
  });

  return { getProgressInfo };
};
