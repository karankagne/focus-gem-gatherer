
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Coins, Gift, TrendingUp, AlertCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../ui/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'digital' | 'physical' | 'feature';
  image?: string;
}

interface RewardSystemProps {
  coins: number;
  onSpendCoins?: (amount: number) => void;
  className?: string;
}

// Sample reward items
const sampleRewards: RewardItem[] = [
  {
    id: '1',
    name: 'Study Music Pack',
    description: 'Unlock premium focus music tracks',
    cost: 100,
    category: 'digital',
  },
  {
    id: '2',
    name: 'Dark Theme',
    description: 'Enable dark mode for the app',
    cost: 50,
    category: 'feature',
  },
  {
    id: '3',
    name: 'Focus Wallpapers',
    description: 'Beautiful wallpapers for your device',
    cost: 75,
    category: 'digital',
  },
  {
    id: '4',
    name: 'Extended Stats',
    description: 'Detailed analytics of your focus sessions',
    cost: 150,
    category: 'feature',
  },
];

const RewardSystem = ({ coins = 0, onSpendCoins, className }: RewardSystemProps) => {
  const [rewards] = useState<RewardItem[]>(sampleRewards);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filteredRewards = selectedFilter
    ? rewards.filter((reward) => reward.category === selectedFilter)
    : rewards;

  const handlePurchase = (reward: RewardItem) => {
    if (coins >= reward.cost) {
      onSpendCoins?.(reward.cost);
      toast.success(`Purchased ${reward.name}!`, {
        description: `You spent ${reward.cost} coins`,
        icon: <Gift className="h-4 w-4" />,
      });
    } else {
      toast.error("Not enough coins", {
        description: `You need ${reward.cost - coins} more coins`,
        icon: <Coins className="h-4 w-4" />,
      });
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Rewards</h2>
          <p className="text-muted-foreground">Spend your hard-earned focus coins</p>
        </div>
        <div className="flex items-center bg-accent/10 px-4 py-2 rounded-xl">
          <Coins className="h-5 w-5 text-yellow-500 mr-2" />
          <AnimatedCounter 
            value={coins} 
            className="font-bold text-xl" 
            formatter={(val) => val.toString()}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant={selectedFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter(null)}
          className="rounded-full"
        >
          All
        </Button>
        <Button
          variant={selectedFilter === 'digital' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter('digital')}
          className="rounded-full"
        >
          Digital
        </Button>
        <Button
          variant={selectedFilter === 'feature' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter('feature')}
          className="rounded-full"
        >
          Features
        </Button>
        <Button
          variant={selectedFilter === 'physical' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter('physical')}
          className="rounded-full"
        >
          Physical
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRewards.map((reward) => (
          <GlassCard
            key={reward.id}
            className="flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{reward.name}</h3>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
              </div>
              <Badge className="bg-accent text-white">
                <Coins className="h-3 w-3 mr-1" /> {reward.cost}
              </Badge>
            </div>
            
            <div className="mt-2">
              <Button
                onClick={() => handlePurchase(reward)}
                className={cn(
                  "w-full", 
                  coins >= reward.cost 
                    ? "bg-focus hover:bg-focus-dark text-white" 
                    : "bg-muted text-muted-foreground hover:bg-muted"
                )}
                disabled={coins < reward.cost}
              >
                {coins >= reward.cost ? "Redeem" : "Not enough coins"}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredRewards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No rewards available in this category.</p>
        </div>
      )}

      <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-accent mt-1" />
          <div>
            <h3 className="font-medium">Earn more coins</h3>
            <p className="text-sm text-muted-foreground">Complete focus sessions and challenges to earn coins faster.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSystem;
