
import React, { useState } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Define the FriendStatus type
type FriendStatus = 'none' | 'requested' | 'friend';

// Define the User interface
interface User {
  id: string;
  name: string;
  friendStatus: FriendStatus;
}

// Mock user data - in a real app, this would come from an API
const mockUsers: User[] = [
  { id: 'u1', name: 'Alex Johnson', friendStatus: 'none' },
  { id: 'u2', name: 'Morgan Smith', friendStatus: 'none' },
  { id: 'u3', name: 'Jordan Lee', friendStatus: 'none' },
  { id: 'u4', name: 'Taylor Kim', friendStatus: 'none' },
  { id: 'u5', name: 'Casey Zhang', friendStatus: 'none' },
];

const FindUsersDialog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddFriend = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, friendStatus: 'requested' as FriendStatus } 
          : user
      )
    );
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success('Friend request sent!', {
        description: `You've sent a friend request to ${user.name}`,
      });
    }
  };

  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Search size={16} />
          Find Friends
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Find Study Partners</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                  <Button
                    variant={user.friendStatus === 'requested' ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleAddFriend(user.id)}
                    disabled={user.friendStatus === 'requested'}
                  >
                    {user.friendStatus === 'requested' ? (
                      <>
                        <Check size={16} className="mr-1" />
                        Requested
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} className="mr-1" />
                        Add Friend
                      </>
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No users found with that name
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindUsersDialog;
