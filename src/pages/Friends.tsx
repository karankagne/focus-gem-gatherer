
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, UserPlus, Users, Search, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import FindUsersDialog from '@/components/features/FindUsersDialog';
import GlassCard from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

// Types for friend data
export type FriendStatus = 'pending' | 'accepted' | 'incoming';

export interface Friend {
  id: string;
  name: string;
  status: FriendStatus;
  lastSeen?: string;
}

// Mock friends data - in a real app, this would come from API
const mockFriends: Friend[] = [
  { id: 'f1', name: 'Alex Johnson', status: 'accepted', lastSeen: '2 hours ago' },
  { id: 'f2', name: 'Morgan Smith', status: 'accepted', lastSeen: '1 day ago' },
  { id: 'f3', name: 'Taylor Kim', status: 'pending' },
  { id: 'f4', name: 'Jordan Lee', status: 'incoming' },
];

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingFriends = friends.filter(f => f.status === 'pending');
  const incomingRequests = friends.filter(f => f.status === 'incoming');
  
  const filteredFriends = searchQuery
    ? friends.filter(friend => 
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

  const handleAcceptFriend = (friendId: string) => {
    setFriends(prev => 
      prev.map(friend => 
        friend.id === friendId 
          ? { ...friend, status: 'accepted' as FriendStatus } 
          : friend
      )
    );
    
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      toast.success('Friend request accepted!', {
        description: `You are now friends with ${friend.name}`,
      });
    }
  };

  const handleDeclineFriend = (friendId: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
    
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      toast.success('Friend request declined!', {
        description: `You declined ${friend.name}'s request`,
      });
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
    
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      toast.success('Friend removed', {
        description: `You removed ${friend.name} from your friends list`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary pb-20 sm:pb-0 sm:pt-16">
      <Header />

      <main className="max-w-screen-md mx-auto px-4 py-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Friends</h1>
              <p className="text-muted-foreground">Connect and study together with friends</p>
            </div>
            
            <div className={`flex ${isMobile ? 'flex-row justify-between' : 'gap-2'}`}>
              <Button variant="outline" className="gap-2" onClick={() => navigator.clipboard.writeText(`https://app.focusgem.com/connect/user123`)}>
                <UserPlus size={16} />
                Copy My Link
              </Button>
              <FindUsersDialog />
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="w-full max-w-full overflow-x-auto">
            <TabsTrigger value="all" className="relative">
              All
              {friends.length > 0 && (
                <Badge className="ml-2 px-1 h-5 min-w-5 flex items-center justify-center">{friends.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted" className="relative">
              Friends
              {acceptedFriends.length > 0 && (
                <Badge className="ml-2 px-1 h-5 min-w-5 flex items-center justify-center">{acceptedFriends.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Requests
              {(pendingFriends.length + incomingRequests.length) > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 h-5 min-w-5 flex items-center justify-center">
                  {pendingFriends.length + incomingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <FriendCard 
                  key={friend.id}
                  friend={friend}
                  onAccept={handleAcceptFriend}
                  onDecline={handleDeclineFriend}
                  onRemove={handleRemoveFriend}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No friends found</h3>
                <p className="text-muted-foreground mt-2">You don't have any friends yet or none match your search</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accepted" className="space-y-4">
            {acceptedFriends.length > 0 ? (
              acceptedFriends.map(friend => (
                <FriendCard 
                  key={friend.id}
                  friend={friend}
                  onRemove={handleRemoveFriend}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No friends yet</h3>
                <p className="text-muted-foreground mt-2">Find and add friends to connect with them</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            {incomingRequests.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2">Incoming Requests</h3>
                {incomingRequests.map(friend => (
                  <FriendCard 
                    key={friend.id}
                    friend={friend}
                    onAccept={handleAcceptFriend}
                    onDecline={handleDeclineFriend}
                  />
                ))}
              </>
            )}
            
            {pendingFriends.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2 mt-6">Sent Requests</h3>
                {pendingFriends.map(friend => (
                  <FriendCard 
                    key={friend.id}
                    friend={friend}
                    onCancel={handleDeclineFriend}
                  />
                ))}
              </>
            )}
            
            {incomingRequests.length === 0 && pendingFriends.length === 0 && (
              <div className="text-center py-8">
                <UserPlus className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No pending requests</h3>
                <p className="text-muted-foreground mt-2">You don't have any pending friend requests</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface FriendCardProps {
  friend: Friend;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const FriendCard = ({ friend, onAccept, onDecline, onCancel, onRemove }: FriendCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {friend.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{friend.name}</h3>
            {friend.status === 'accepted' && friend.lastSeen && (
              <p className="text-xs text-muted-foreground">Last seen: {friend.lastSeen}</p>
            )}
            {friend.status === 'pending' && (
              <Badge variant="outline" className="mt-1">Request sent</Badge>
            )}
            {friend.status === 'incoming' && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 mt-1">Wants to connect</Badge>
            )}
          </div>
        </div>
        
        <div className={`flex gap-2 ${isMobile ? 'w-full mt-2 justify-center' : ''}`}>
          {friend.status === 'incoming' && (
            <>
              <Button size="sm" variant="default" onClick={() => onAccept?.(friend.id)}>
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDecline?.(friend.id)}>
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </>
          )}
          
          {friend.status === 'pending' && (
            <Button size="sm" variant="outline" onClick={() => onCancel?.(friend.id)}>
              Cancel
            </Button>
          )}
          
          {friend.status === 'accepted' && (
            <Button size="sm" variant="outline" onClick={() => onRemove?.(friend.id)}>
              <UserMinus className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default Friends;
