
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Plus, X, Check, AlertCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AppData {
  id: string;
  name: string;
  icon: string;
  isBlocked: boolean;
}

interface AppBlockerProps {
  className?: string;
}

// Sample app data (would be fetched from device in a real implementation)
const sampleApps: AppData[] = [
  { id: '1', name: 'Instagram', icon: '📱', isBlocked: true },
  { id: '2', name: 'TikTok', icon: '📱', isBlocked: true },
  { id: '3', name: 'YouTube', icon: '📱', isBlocked: false },
  { id: '4', name: 'Twitter', icon: '📱', isBlocked: false },
  { id: '5', name: 'Facebook', icon: '📱', isBlocked: false },
];

const AppBlocker = ({ className }: AppBlockerProps) => {
  const [apps, setApps] = useState<AppData[]>(sampleApps);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');

  const toggleAppBlock = (id: string) => {
    setApps(
      apps.map((app) =>
        app.id === id ? { ...app, isBlocked: !app.isBlocked } : app
      )
    );
    
    const app = apps.find(app => app.id === id);
    if (app) {
      toast(app.isBlocked ? `Unblocked ${app.name}` : `Blocked ${app.name}`, {
        icon: app.isBlocked ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />
      });
    }
  };

  const addNewApp = () => {
    if (newAppName.trim()) {
      const newApp: AppData = {
        id: Date.now().toString(),
        name: newAppName.trim(),
        icon: '📱',
        isBlocked: true,
      };
      
      setApps([...apps, newApp]);
      setNewAppName('');
      setIsAddDialogOpen(false);
      
      toast.success(`Added ${newAppName} to blocked apps`);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Blocked Apps</h2>
          <p className="text-muted-foreground">Apps that will be inaccessible during focus time</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          size="icon"
          className="rounded-full h-10 w-10 bg-focus text-white"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {apps.map((app) => (
          <GlassCard 
            key={app.id} 
            className={cn(
              "flex items-center gap-3 p-4",
              app.isBlocked ? "border-focus/20" : "border-transparent opacity-70"
            )}
            onClick={() => toggleAppBlock(app.id)}
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 text-xl">
              {app.icon}
            </div>
            <div className="flex-grow">
              <div className="font-medium">{app.name}</div>
              <div className="text-xs text-muted-foreground">Tap to {app.isBlocked ? 'unblock' : 'block'}</div>
            </div>
            <div className="flex-shrink-0">
              {app.isBlocked ? (
                <Badge variant="outline" className="bg-focus/10 text-focus border-focus/20">
                  <Lock className="h-3 w-3 mr-1" /> Blocked
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Allowed
                </Badge>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {apps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No apps added yet. Add apps to block during focus time.</p>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add App to Block</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="App name (e.g., Instagram)"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewApp} className="bg-focus hover:bg-focus-dark text-white">
              Add App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppBlocker;
