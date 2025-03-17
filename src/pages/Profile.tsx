
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import BadgeDisplay, { SampleBadges } from '@/components/features/BadgeDisplay';
import GlassCard from '@/components/ui/GlassCard';
import { useFocus } from '@/contexts/FocusContext';
import { AlarmClock, Calendar, Target, Award, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const { totalFocusTime, focusSessions, streakDays } = useFocus();

  // Weekly focus data
  const weeklyData = [2, 3.5, 1, 4, 2.5, 0.5, 3]; // Hours per day
  const maxWeeklyHours = Math.max(...weeklyData);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate level based on total focus time
  const calculateLevel = (minutes: number) => {
    return Math.floor(minutes / 60) + 1;
  };
  
  const currentLevel = calculateLevel(totalFocusTime);
  const nextLevelMinutes = currentLevel * 60;
  const levelProgress = (totalFocusTime % 60) / 60;
  
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Profile</h1>
          <p className="text-muted-foreground">Your focus journey stats and achievements</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold mr-4">
                {currentLevel}
              </div>
              <div className="flex-grow">
                <h2 className="font-semibold text-lg">Level {currentLevel} Focus Master</h2>
                <div className="flex items-center">
                  <Progress value={levelProgress * 100} className="h-2 flex-grow" />
                  <span className="text-xs text-muted-foreground ml-2">
                    {totalFocusTime}/{nextLevelMinutes} min
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <AlarmClock className="h-5 w-5 text-focus mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">Focus Time</div>
                  <div className="font-medium">{totalFocusTime} minutes</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Target className="h-5 w-5 text-accent mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                  <div className="font-medium">{focusSessions}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">Streak</div>
                  <div className="font-medium">{streakDays} days</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <div className="text-sm text-muted-foreground">Badges</div>
                  <div className="font-medium">{SampleBadges.filter(b => b.unlocked).length}</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Weekly Focus
          </h2>
          <GlassCard className="p-6">
            <div className="flex h-40 items-end justify-between gap-2">
              {weeklyData.map((hours, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-10 bg-focus rounded-t-md transition-all duration-500"
                    style={{ 
                      height: `${(hours / maxWeeklyHours) * 100}%`,
                      opacity: 0.6 + (hours / maxWeeklyHours) * 0.4
                    }}
                  />
                  <div className="text-xs mt-2">{weekdays[index]}</div>
                  <div className="text-xs text-muted-foreground">{hours}h</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <BadgeDisplay badges={SampleBadges} />
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
