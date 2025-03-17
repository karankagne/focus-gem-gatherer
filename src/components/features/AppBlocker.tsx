
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Plus, X, Check, AlertCircle, Bell, BellOff } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import NotificationBlocker from '@/plugins/NotificationBlocker';

interface AppData {
  id: string;
  name: string;
  icon: string;
  isBlocked: boolean;
  blockNotifications: boolean;
}

interface AppBlockerProps {
  className?: string;
}

// Sample app data (would be fetched from device in a real implementation)
const sampleApps: AppData[] = [
  { id: '1', name: 'Instagram', icon: '📱', isBlocked: true, blockNotifications: true },
  { id: '2', name: 'TikTok', icon: '📱', isBlocked: true, blockNotifications: true },
  { id: '3', name: 'YouTube', icon: '📱', isBlocked: false, blockNotifications: false },
  { id: '4', name: 'Twitter', icon: '📱', isBlocked: false, blockNotifications: false },
  { id: '5', name: 'Facebook', icon: '📱', isBlocked: false, blockNotifications: false },
];

const AppBlocker = ({ className }: AppBlockerProps) => {
  const [apps, setApps] = useState<AppData[]>(sampleApps);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  // Check notification permission on component mount
  useEffect(() => {
    if (isNative) {
      checkPermission();
    } else {
      setHasPermission(true); // In web environment, assume we have permission
    }
  }, []);

  const checkPermission = async () => {
    try {
      const { hasPermission } = await NotificationBlocker.checkNotificationPermission();
      setHasPermission(hasPermission);
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const { granted } = await NotificationBlocker.requestNotificationPermission();
      setHasPermission(granted);
      
      if (granted) {
        toast.success('Notification control permission granted');
      } else {
        toast.error('Permission denied', {
          description: 'You need to grant permission to block notifications'
        });
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Failed to request permission');
    }
  };

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

  const toggleNotificationBlock = async (id: string) => {
    if (!hasPermission && isNative) {
      toast.error('Permission required', {
        description: 'Please grant notification control permission first',
        action: {
          label: 'Grant',
          onClick: requestPermission
        }
      });
      return;
    }

    const app = apps.find(app => app.id === id);
    if (!app) return;

    try {
      if (!app.blockNotifications) {
        await NotificationBlocker.blockAppNotifications({ packageName: app.name.toLowerCase() });
        toast.success(`Notifications blocked for ${app.name}`, {
          icon: <BellOff className="h-4 w-4" />
        });
      } else {
        await NotificationBlocker.unblockAppNotifications({ packageName: app.name.toLowerCase() });
        toast.success(`Notifications enabled for ${app.name}`, {
          icon: <Bell className="h-4 w-4" />
        });
      }

      setApps(
        apps.map((a) =>
          a.id === id ? { ...a, blockNotifications: !a.blockNotifications } : a
        )
      );
    } catch (error) {
      console.error('Error toggling notification block:', error);
      toast.error('Failed to update notification settings');
    }
  };

  const addNewApp = () => {
    if (newAppName.trim()) {
      const newApp: AppData = {
        id: Date.now().toString(),
        name: newAppName.trim(),
        icon: '📱',
        isBlocked: true,
        blockNotifications: true,
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

      {!hasPermission && isNative && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-500">Permission Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                To block notifications from apps, you need to grant additional permissions.
              </p>
              <Button 
                onClick={requestPermission}
                size="sm" 
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Grant Permission
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {apps.map((app) => (
          <GlassCard 
            key={app.id} 
            className={cn(
              "flex items-center gap-3 p-4",
              app.isBlocked ? "border-focus/20" : "border-transparent opacity-70"
            )}
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 text-xl">
              {app.icon}
            </div>
            <div className="flex-grow">
              <div className="font-medium">{app.name}</div>
              <div className="text-xs text-muted-foreground mb-1">Tap to configure</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Switch 
                    checked={app.isBlocked} 
                    onCheckedChange={() => toggleAppBlock(app.id)}
                    size="sm"
                  />
                  <span className="text-xs">Block app</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Switch 
                    checked={app.blockNotifications} 
                    onCheckedChange={() => toggleNotificationBlock(app.id)}
                    size="sm"
                  />
                  <span className="text-xs">Block notifications</span>
                </div>
              </div>
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
