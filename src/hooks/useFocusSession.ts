
import { useState, useEffect, useCallback } from 'react';
import { useFocus } from '@/contexts/FocusContext';
import { toast } from 'sonner';

interface UseFocusSessionOptions {
  onSessionComplete?: () => void;
  initialDuration?: number; // in minutes
}

export const useFocusSession = (options: UseFocusSessionOptions = {}) => {
  const { initialDuration = 25 } = options;
  const [duration, setDuration] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopConfirmationOpen, setIsStopConfirmationOpen] = useState(false);
  
  const { earnCoins, startFocusSession: contextStartSession, endFocusSession: contextEndSession } = useFocus();

  // Update duration when initialDuration changes
  useEffect(() => {
    if (!isActive) {
      setDuration(initialDuration);
      setTimeElapsed(0);
    }
  }, [initialDuration, isActive]);

  const startSession = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    setTimeElapsed(0);
    
    // Call the context's startFocusSession to trigger app blocking
    contextStartSession(duration);
    
    toast('Focus session started', {
      description: `Stay focused for ${duration} minutes to earn coins!`,
    });
  }, [duration, contextStartSession]);

  const pauseSession = useCallback(() => {
    // If already active, we should show confirmation before pausing
    if (isActive && !isPaused) {
      setIsStopConfirmationOpen(true);
      return;
    }
    
    setIsPaused(true);
    toast('Session paused', {
      description: 'Take a short break, but don\'t forget to come back!',
    });
  }, [isActive, isPaused]);

  const confirmPauseSession = useCallback(() => {
    setIsPaused(true);
    setIsStopConfirmationOpen(false);
    
    toast('Session paused', {
      description: 'Take a short break, but don\'t forget to come back!',
    });
  }, []);

  const cancelPauseSession = useCallback(() => {
    setIsStopConfirmationOpen(false);
  }, []);

  const resumeSession = useCallback(() => {
    setIsPaused(false);
    toast('Session resumed', {
      description: 'Keep going! You\'re doing great!',
    });
  }, []);

  const endSession = useCallback((completed = false) => {
    setIsActive(false);
    setIsPaused(false);
    
    // Notify the context that the session has ended
    contextEndSession(completed);
    
    if (completed) {
      const earnedCoins = Math.floor(timeElapsed / 60);
      earnCoins(earnedCoins);
      
      toast.success('Focus session completed!', {
        description: `You earned ${earnedCoins} coins for staying focused!`,
      });
      
      options.onSessionComplete?.();
    } else {
      toast('Session ended early', {
        description: 'You can start a new session when you\'re ready.',
      });
    }
  }, [timeElapsed, earnCoins, options, contextEndSession]);

  const resetSession = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setTimeElapsed(0);
    
    // End session in context
    contextEndSession(false);
  }, [contextEndSession]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Check if session is complete
          if (newTime >= duration * 60) {
            endSession(true);
            clearInterval(interval!);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, endSession]);

  const timeRemaining = duration * 60 - timeElapsed;
  const progress = timeElapsed / (duration * 60);

  return {
    isActive,
    isPaused,
    timeElapsed,
    timeRemaining,
    progress,
    duration,
    isStopConfirmationOpen,
    setDuration,
    startSession,
    pauseSession,
    confirmPauseSession,
    cancelPauseSession,
    resumeSession,
    endSession,
    resetSession,
    setIsStopConfirmationOpen,
  };
};

export default useFocusSession;
