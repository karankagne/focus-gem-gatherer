
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Users, Trophy, Timer, Calendar, Wifi, WifiOff, MessageSquare } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AnimatedCounter from '../ui/AnimatedCounter';
import { toast } from 'sonner';
import ChatDialog from './ChatDialog';

interface Participant {
  id: string;
  name: string;
  progress: number;
}

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  type: 'solo' | 'group' | 'global';
  participants?: Participant[];
  goal: number; // hours or sessions
  timeLeft?: string; // e.g., "2 days left"
  reward: number; // coins
  userProgress: number; // value between 0 and 1
  joined?: boolean;
  onJoin?: (id: string, isOnline: boolean) => void;
  className?: string;
}

const ChallengeCard = ({
  id,
  title,
  description,
  type,
  participants = [],
  goal,
  timeLeft,
  reward,
  userProgress,
  joined = false,
  onJoin,
  className,
}: ChallengeCardProps) => {
  const maxParticipantsToShow = 3;
  const progressPercent = userProgress * 100;
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [isChatOpen, setIsChatOpen] = useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleJoinChallenge = () => {
    if (onJoin) {
      onJoin(id, isOnline);
    }
  };

  const openChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsChatOpen(true);
  };

  return (
    <>
      <GlassCard className={cn('overflow-hidden', className)}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {type === 'solo' ? 'Solo' : type === 'group' ? 'Group' : 'Global'}
                </Badge>
                {timeLeft && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" /> {timeLeft}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-yellow-500 font-semibold">
                <Trophy className="h-4 w-4 mr-1" />
                <span>{reward}</span>
              </div>
              <div className="text-xs text-muted-foreground">coins reward</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1 text-sm">
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Goal: {goal} {goal === 1 ? 'hour' : 'hours'}</span>
              </div>
              <span className="text-focus font-medium">
                <AnimatedCounter 
                  value={progressPercent} 
                  formatter={(val) => `${Math.round(val)}%`} 
                />
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {type !== 'solo' && participants.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {participants.slice(0, maxParticipantsToShow).map((participant, index) => (
                  <div 
                    key={participant.id}
                    className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium border-2 border-background"
                  >
                    {participant.name.charAt(0)}
                  </div>
                ))}
                {participants.length > maxParticipantsToShow && (
                  <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-medium border-2 border-background">
                    +{participants.length - maxParticipantsToShow}
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>{participants.length} participants</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!joined && (
              <Button 
                onClick={handleJoinChallenge} 
                className="w-full mt-2 bg-focus hover:bg-focus-dark text-white"
              >
                {isOnline ? (
                  <span className="flex items-center">
                    Join Challenge
                  </span>
                ) : (
                  <span className="flex items-center">
                    <WifiOff className="h-4 w-4 mr-1" />
                    Join Offline
                  </span>
                )}
              </Button>
            )}
            
            {(type === 'group' || type === 'global') && joined && participants.length > 0 && (
              <Button 
                variant="outline"
                onClick={openChat} 
                className="flex-1 mt-2"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </Button>
            )}
          </div>
          
          {!isOnline && joined && (
            <div className="mt-2 text-xs text-amber-500 flex items-center">
              <WifiOff className="h-3 w-3 mr-1" />
              <span>Will sync when online</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Chat Dialog */}
      <ChatDialog 
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        challengeId={id}
        challengeTitle={title}
        participants={participants || []}
      />
    </>
  );
};

export default ChallengeCard;
