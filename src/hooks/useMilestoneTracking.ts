
import { useEffect } from 'react';
import { toast } from 'sonner';

const MILESTONE_PERCENTAGES = [10, 25, 40, 60, 80, 100];

const generateMotivationalMessage = (currentCount: number, target: number, percentage: number): string => {
  const motivationalPhrases = [
    "🎉 Amazing progress! You're absolutely crushing it!",
    "🚀 Fantastic work! Your dedication is paying off!",
    "⭐ Incredible momentum! You're on fire today!",
    "🏆 Outstanding effort! Keep pushing forward!",
    "🎯 Phenomenal progress! You're unstoppable!",
    "💫 Spectacular achievement! Your consistency shines!",
    "🌟 Legendary dedication! You're in the zone!",
    "🔥 Unstoppable energy! You're making it happen!",
    "💎 Exceptional commitment! You're a true professional!",
    "👑 Magnificent progress! You're absolutely dominating!",
  ];

  const baseMessage = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
  
  if (percentage === 100) {
    return `🎊 INCREDIBLE! You've completed your daily target of ${target} comments! ${baseMessage} You're a commenting master!`;
  } else if (percentage >= 80) {
    return `${baseMessage} You're ${percentage}% there with ${currentCount} comments - almost at your ${target} target!`;
  } else if (percentage >= 60) {
    return `${baseMessage} You've hit ${percentage}% of your goal with ${currentCount} comments! ${target - currentCount} more to go!`;
  } else if (percentage >= 40) {
    return `${baseMessage} You're ${percentage}% of the way with ${currentCount} comments! Halfway there!`;
  } else if (percentage >= 25) {
    return `${baseMessage} You've reached ${percentage}% with ${currentCount} comments! Building great momentum!`;
  } else {
    return `${baseMessage} You're ${percentage}% there with ${currentCount} comments! Great start towards your ${target} target!`;
  }
};

const shouldShowMilestone = (currentCount: number, target: number): boolean => {
  const percentage = Math.round((currentCount / target) * 100);
  return MILESTONE_PERCENTAGES.includes(percentage) && currentCount > 0;
};

export const useMilestoneTracking = (currentCount: number, dailyTarget: number = 20) => {
  useEffect(() => {
    if (shouldShowMilestone(currentCount, dailyTarget)) {
      const percentage = Math.round((currentCount / dailyTarget) * 100);
      const milestoneKey = `milestone-${percentage}-${new Date().toDateString()}`;
      
      // Check if we've already shown this milestone today
      const hasShownMilestone = sessionStorage.getItem(milestoneKey);
      if (!hasShownMilestone) {
        const message = generateMotivationalMessage(currentCount, dailyTarget, percentage);
        
        toast.success(message, {
          description: `Progress: ${currentCount}/${dailyTarget} comments (${percentage}% complete)`,
          duration: 6000,
        });
        
        // Mark this milestone as shown for today
        sessionStorage.setItem(milestoneKey, 'true');
      }
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
