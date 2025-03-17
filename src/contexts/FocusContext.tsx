
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FocusContextType {
  isInFocusSession: boolean;
  sessionTimeRemaining: number;
  totalFocusTime: number;
  focusSessions: number;
  coins: number;
  streakDays: number;
  allowedApps: string[]; // New: Array of package names allowed during focus
  startFocusSession: (minutes: number) => void;
  endFocusSession: (completed?: boolean) => void;
  updateSessionTime: (seconds: number) => void;
  earnCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  toggleAllowedApp: (packageName: string) => void; // New: Toggle app in allowed list
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

interface FocusProviderProps {
  children: React.ReactNode;
}

export const FocusProvider = ({ children }: FocusProviderProps) => {
  const [isInFocusSession, setIsInFocusSession] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(25); // Default 25 minutes
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [focusSessions, setFocusSessions] = useState(0);
  const [coins, setCoins] = useState(120); // Starting coins
  const [streakDays, setStreakDays] = useState(3); // Starting streak
  const [allowedApps, setAllowedApps] = useState<string[]>([]); // New: Store allowed apps

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('focusData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTotalFocusTime(data.totalFocusTime || 0);
        setFocusSessions(data.focusSessions || 0);
        setCoins(data.coins || 0);
        setStreakDays(data.streakDays || 0);
        setAllowedApps(data.allowedApps || []); // Load allowed apps
      } catch (error) {
        console.error('Error loading focus data:', error);
      }
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    const dataToSave = {
      totalFocusTime,
      focusSessions,
      coins,
      streakDays,
      allowedApps, // Save allowed apps
    };
    localStorage.setItem('focusData', JSON.stringify(dataToSave));
  }, [totalFocusTime, focusSessions, coins, streakDays, allowedApps]);

  const startFocusSession = (minutes: number) => {
    setIsInFocusSession(true);
    setSessionDuration(minutes);
    setSessionTimeRemaining(minutes * 60);
  };

  const endFocusSession = (completed = false) => {
    if (completed) {
      // Calculate coins based on session length
      const sessionMinutes = Math.floor(sessionDuration);
      const earnedCoins = sessionMinutes;
      earnCoins(earnedCoins);
      
      // Update session stats
      setFocusSessions(prev => prev + 1);
      setTotalFocusTime(prev => prev + sessionMinutes);
      
      toast.success(`Session completed! +${earnedCoins} coins`, {
        description: `You've completed ${focusSessions + 1} sessions in total.`
      });
    }
    
    setIsInFocusSession(false);
    setSessionTimeRemaining(0);
  };

  const updateSessionTime = (seconds: number) => {
    setSessionTimeRemaining(seconds);
  };

  const earnCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const spendCoins = (amount: number) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  // New: Toggle an app in the allowed list
  const toggleAllowedApp = (packageName: string) => {
    setAllowedApps(prev => 
      prev.includes(packageName)
        ? prev.filter(app => app !== packageName)
        : [...prev, packageName]
    );
  };

  return (
    <FocusContext.Provider
      value={{
        isInFocusSession,
        sessionTimeRemaining,
        totalFocusTime,
        focusSessions,
        coins,
        streakDays,
        allowedApps,
        startFocusSession,
        endFocusSession,
        updateSessionTime,
        earnCoins,
        spendCoins,
        toggleAllowedApp,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};
