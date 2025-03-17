
import React from 'react';
import { cn } from '@/lib/utils';
import { Trophy, Star, Clock, EyeOff, Fire } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  level?: 'bronze' | 'silver' | 'gold';
}

interface BadgeDisplayProps {
  badges: Badge[];
  className?: string;
}

// Helper function to get badge color based on level
const getBadgeColor = (level?: 'bronze' | 'silver' | 'gold', unlocked = false) => {
  if (!unlocked) return 'bg-gray-200 text-gray-500';
  
  switch (level) {
    case 'gold':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'silver':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'bronze':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    default:
      return 'bg-blue-100 text-blue-700 border-blue-300';
  }
};

const BadgeDisplay = ({ badges, className }: BadgeDisplayProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-2xl font-semibold tracking-tight">Achievements</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <GlassCard
            key={badge.id}
            className={cn(
              "flex flex-col items-center text-center p-4 transition-all",
              badge.unlocked ? "opacity-100" : "opacity-50"
            )}
          >
            <div 
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center mb-3 border-2",
                getBadgeColor(badge.level, badge.unlocked)
              )}
            >
              {badge.icon}
            </div>
            <h3 className="font-medium mb-1">{badge.name}</h3>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
            
            {badge.progress !== undefined && badge.progress < 1 && (
              <div className="w-full mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-focus"
                  style={{ width: `${badge.progress * 100}%` }}
                />
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// Example usage
export const SampleBadges: Badge[] = [
  {
    id: '1',
    name: 'First Focus',
    description: 'Complete your first focus session',
    icon: <Clock className="h-6 w-6" />,
    unlocked: true,
    level: 'bronze',
  },
  {
    id: '2',
    name: 'Focus Streak',
    description: 'Complete 3 sessions in a row',
    icon: <Fire className="h-6 w-6" />,
    unlocked: true,
    level: 'silver',
  },
  {
    id: '3',
    name: 'Distraction Master',
    description: 'Block 10 apps',
    icon: <EyeOff className="h-6 w-6" />,
    unlocked: false,
    progress: 0.7,
  },
  {
    id: '4',
    name: 'Golden Focus',
    description: 'Complete 50 focus sessions',
    icon: <Trophy className="h-6 w-6" />,
    unlocked: false,
    progress: 0.2,
    level: 'gold',
  },
];

export default BadgeDisplay;
