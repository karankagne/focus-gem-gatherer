
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, RefreshCw } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FocusTimerProps {
  initialTime?: number; // in minutes
  onComplete?: () => void;
  onTimeUpdate?: (timeRemaining: number) => void;
  className?: string;
}

const FocusTimer = ({
  initialTime = 25,
  onComplete,
  onTimeUpdate,
  className,
}: FocusTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime * 60); // convert to seconds
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        const newTime = timeRemaining - 1;
        setTimeRemaining(newTime);
        onTimeUpdate?.(newTime);
      }, 1000);
    } else if (timeRemaining === 0 && !isCompleted) {
      setIsActive(false);
      setIsCompleted(true);
      onComplete?.();
      toast.success('Focus session completed! Coins earned!');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, onComplete, onTimeUpdate, isCompleted]);

  const startTimer = () => {
    setIsActive(true);
    toast('Focus session started', {
      description: 'Stay focused to earn coins!',
    });
  };

  const pauseTimer = () => {
    // If already active, show confirmation dialog before stopping
    if (isActive) {
      setIsStopDialogOpen(true);
    } else {
      startTimer();
    }
  };

  const confirmStopTimer = () => {
    setIsActive(false);
    setIsStopDialogOpen(false);
    toast('Focus session paused', {
      description: 'Remember, you earn coins by staying focused!',
    });
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(initialTime * 60);
    setIsCompleted(false);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeRemaining / (initialTime * 60);
  const timerSize = isMobile ? 'w-56 h-56' : 'w-64 h-64';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn("relative flex items-center justify-center mb-6", timerSize)}>
        {/* Circular progress background */}
        <div className="absolute inset-0 rounded-full bg-secondary" />
        
        {/* Circular progress indicator */}
        <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`${progress * 283} 283`}
            className="text-focus transition-all duration-300"
          />
        </svg>
        
        {/* Timer display */}
        <div className="relative z-10 text-5xl font-bold text-focus">
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={resetTimer}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        
        <Button
          className="w-16 h-16 rounded-full bg-focus hover:bg-focus-dark text-white"
          onClick={pauseTimer}
        >
          {isActive ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>
      </div>

      {/* Emergency Stop Dialog */}
      <AlertDialog open={isStopDialogOpen} onOpenChange={setIsStopDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to stop?</AlertDialogTitle>
            <AlertDialogDescription>
              Stopping your focus session early will interrupt your flow and may reduce the coins you earn. 
              Please only stop if there's an emergency.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Session</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStopTimer} className="bg-destructive text-destructive-foreground">
              Stop Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FocusTimer;
