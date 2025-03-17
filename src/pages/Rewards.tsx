
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import RewardSystem from '@/components/features/RewardSystem';
import { useFocus } from '@/contexts/FocusContext';

const Rewards = () => {
  const { coins, spendCoins } = useFocus();

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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Rewards</h1>
          <p className="text-muted-foreground">Redeem your focus coins for rewards</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RewardSystem coins={coins} onSpendCoins={spendCoins} />
        </motion.div>
      </main>
    </div>
  );
};

export default Rewards;
