
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import ChallengeCard from '@/components/features/ChallengeCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Sample challenges data
const sampleChallenges = [
  {
    id: '1',
    title: 'Weekend Focus',
    description: 'Complete 5 hours of focus time over the weekend',
    type: 'solo' as const,
    goal: 5,
    timeLeft: '2 days left',
    reward: 50,
    userProgress: 0.6,
  },
  {
    id: '2',
    title: 'Study Group Challenge',
    description: 'Compete with friends to see who can focus the most',
    type: 'group' as const,
    participants: [
      { id: 'u1', name: 'Alex', progress: 0.7 },
      { id: 'u2', name: 'Morgan', progress: 0.4 },
      { id: 'u3', name: 'Jordan', progress: 0.9 },
    ],
    goal: 10,
    timeLeft: '5 days left',
    reward: 100,
    userProgress: 0.3,
  },
  {
    id: '3',
    title: 'Early Bird',
    description: 'Complete 3 focus sessions before 10 AM',
    type: 'solo' as const,
    goal: 3,
    timeLeft: '6 days left',
    reward: 30,
    userProgress: 0.1,
  },
  {
    id: '4',
    title: 'Global Focus Event',
    description: 'Join students worldwide in a focus marathon',
    type: 'global' as const,
    participants: Array.from({ length: 15 }, (_, i) => ({ 
      id: `g${i}`, 
      name: `User ${i}`, 
      progress: Math.random() 
    })),
    goal: 8,
    timeLeft: '3 days left',
    reward: 150,
    userProgress: 0.2,
  },
];

const Challenges = () => {
  const [challenges, setChallenges] = useState(sampleChallenges);
  const [activeTab, setActiveTab] = useState<'all' | 'solo' | 'group'>('all');

  const filteredChallenges = activeTab === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.type === activeTab);

  const handleJoinChallenge = (id: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id ? { ...challenge, joined: true } : challenge
      )
    );
    
    toast.success('Joined challenge!', {
      description: 'Good luck and stay focused!',
    });
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Challenges</h1>
          <p className="text-muted-foreground">Complete challenges to earn extra rewards</p>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === 'all' ? "default" : "outline"}
            onClick={() => setActiveTab('all')}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={activeTab === 'solo' ? "default" : "outline"}
            onClick={() => setActiveTab('solo')}
            className="rounded-full"
          >
            Solo
          </Button>
          <Button
            variant={activeTab === 'group' ? "default" : "outline"}
            onClick={() => setActiveTab('group')}
            className="rounded-full"
          >
            Group
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredChallenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ChallengeCard
                {...challenge}
                onJoin={() => handleJoinChallenge(challenge.id)}
              />
            </motion.div>
          ))}

          {filteredChallenges.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No {activeTab} challenges available right now.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Challenges;
