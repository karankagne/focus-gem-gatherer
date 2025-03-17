
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlarmClock, Coins, Lock } from 'lucide-react';
import Header from '@/components/layout/Header';
import FocusTimer from '@/components/layout/FocusTimer';
import AppBlocker from '@/components/features/AppBlocker';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { useFocus } from '@/contexts/FocusContext';
import { Button } from '@/components/ui/button';
import { useFocusSession } from '@/hooks/useFocusSession';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Index = () => {
  const { 
    totalFocusTime, 
    focusSessions, 
    coins, 
    streakDays,
    isInFocusSession
  } = useFocus();
  
  const [sessionDuration, setSessionDuration] = useState(25); // Default to 25 minutes
  const [customDuration, setCustomDuration] = useState('');
  const [isCustomTime, setIsCustomTime] = useState(false);
  
  const durations = [15, 25, 45, 60];
  
  const {
    startSession,
    isActive,
    timeRemaining,
    progress,
    endSession,
    pauseSession,
    confirmPauseSession,
    cancelPauseSession,
    resetSession,
    isStopConfirmationOpen,
    setIsStopConfirmationOpen
  } = useFocusSession({
    initialDuration: sessionDuration,
  });

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomDuration(value);
  };

  const applyCustomDuration = () => {
    const duration = parseInt(customDuration);
    if (isNaN(duration) || duration <= 0) {
      toast.error('Please enter a valid time', {
        description: 'Time must be a positive number'
      });
      return;
    }
    
    if (duration > 120) {
      toast.warning('Long focus session', {
        description: 'Sessions over 120 minutes may be difficult to maintain'
      });
    }
    
    setSessionDuration(duration);
    setIsCustomTime(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary pb-20 sm:pb-0 sm:pt-16">
      <Header />

      <main className="max-w-screen-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">FocusBuddy</h1>
          <p className="text-muted-foreground">Block distractions. Earn rewards. Stay focused.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <GlassCard className="text-center">
              <AlarmClock className="h-6 w-6 mx-auto mb-2 text-focus" />
              <div className="text-2xl font-bold">
                <AnimatedCounter value={totalFocusTime} />
              </div>
              <div className="text-xs text-muted-foreground">Focus minutes</div>
            </GlassCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlassCard className="text-center">
              <Coins className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">
                <AnimatedCounter value={coins} />
              </div>
              <div className="text-xs text-muted-foreground">Coins earned</div>
            </GlassCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <GlassCard className={cn("text-center", isInFocusSession ? "border-focus/30" : "")}>
              <Lock className={cn("h-6 w-6 mx-auto mb-2", isInFocusSession ? "text-focus" : "text-accent")} />
              <div className="text-2xl font-bold">{isInFocusSession ? "ON" : "OFF"}</div>
              <div className="text-xs text-muted-foreground">App blocking</div>
            </GlassCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <GlassCard className="text-center">
              <div className="h-6 w-6 mx-auto mb-2 text-red-500">🔥</div>
              <div className="text-2xl font-bold">{streakDays}</div>
              <div className="text-xs text-muted-foreground">Day streak</div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-4">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {!isActive && !isCustomTime && durations.map((minutes) => (
                <Button
                  key={minutes}
                  variant={sessionDuration === minutes ? "default" : "outline"}
                  onClick={() => setSessionDuration(minutes)}
                  className="rounded-full"
                  disabled={isActive}
                >
                  {minutes} min
                </Button>
              ))}
              
              {!isActive && !isCustomTime && (
                <Button
                  variant="outline"
                  onClick={() => setIsCustomTime(true)}
                  className="rounded-full"
                  disabled={isActive}
                >
                  Custom
                </Button>
              )}
              
              {!isActive && isCustomTime && (
                <div className="flex items-center gap-2 w-full max-w-xs mx-auto">
                  <Input
                    type="text"
                    value={customDuration}
                    onChange={handleCustomDurationChange}
                    placeholder="Enter minutes"
                    className="text-center"
                    autoFocus
                  />
                  <Button onClick={applyCustomDuration}>Set</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCustomTime(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <FocusTimer 
                initialTime={sessionDuration}
                onComplete={() => endSession(true)}
                onTimeUpdate={() => {}} 
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AppBlocker />
        </motion.div>
      </main>
    </div>
  );
};

// Helper function to add conditional class names
const cn = (...classes: (string | boolean | undefined)[]) => 
  classes.filter(Boolean).join(' ');

export default Index;
