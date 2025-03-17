
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Check, AlertCircle, Bell, BellOff, Search, ShieldOff, CheckCircle2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import NotificationBlocker, { InstalledApp } from '@/plugins/NotificationBlocker';
import { useFocus } from '@/contexts/FocusContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface AppData {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  isBlocked: boolean;
  blockNotifications: boolean;
}

interface AppBlockerProps {
  className?: string;
}

const AppBlocker = ({ className }: AppBlockerProps) => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAllowedAppsDialogOpen, setIsAllowedAppsDialogOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'allowed' | 'blocked'>('allowed');
  const isNative = Capacitor.isNativePlatform();
  
  const { isInFocusSession, allowedApps, toggleAllowedApp } = useFocus();

  // Check notification permission and load apps on component mount
  useEffect(() => {
    const initializeApps = async () => {
      if (isNative) {
        await checkPermission();
      } else {
        setHasPermission(true); // In web environment, assume we have permission
      }
      
      await fetchInstalledApps();
    };
    
    initializeApps();
  }, []);

  // Show allowed apps dialog when starting a focus session
  useEffect(() => {
    if (isInFocusSession && !isAllowedAppsDialogOpen) {
      setIsAllowedAppsDialogOpen(true);
    }
  }, [isInFocusSession]);

  const fetchInstalledApps = async () => {
    setIsLoading(true);
    try {
      const { apps: installedApps } = await NotificationBlocker.getInstalledApps();
      
      // Convert the installed apps to our app data format
      const appData: AppData[] = installedApps.map(app => ({
        id: app.packageName,
        name: app.appName,
        packageName: app.packageName,
        icon: app.icon || '📱',
        isBlocked: false,
        blockNotifications: false,
      }));
      
      setApps(appData);
    } catch (error) {
      console.error('Error fetching installed apps:', error);
      toast.error('Failed to load installed apps');
      
      // Fallback to sample data if fetching fails
      setApps([
        { id: 'com.instagram.android', packageName: 'com.instagram.android', name: 'Instagram', icon: '📱', isBlocked: false, blockNotifications: false },
        { id: 'com.tiktok.android', packageName: 'com.tiktok.android', name: 'TikTok', icon: '📱', isBlocked: false, blockNotifications: false },
        { id: 'com.google.android.youtube', packageName: 'com.google.android.youtube', name: 'YouTube', icon: '📱', isBlocked: false, blockNotifications: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
        await NotificationBlocker.blockAppNotifications({ packageName: app.packageName });
        toast.success(`Notifications blocked for ${app.name}`, {
          icon: <BellOff className="h-4 w-4" />
        });
      } else {
        await NotificationBlocker.unblockAppNotifications({ packageName: app.packageName });
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

  // Handle toggling app in allowed list during focus mode
  const handleAllowedAppToggle = (packageName: string) => {
    toggleAllowedApp(packageName);
    
    const app = apps.find(app => app.packageName === packageName);
    if (app) {
      const isNowAllowed = !allowedApps.includes(packageName);
      toast(
        isNowAllowed 
          ? `${app.name} will be accessible during focus` 
          : `${app.name} will be blocked during focus`,
        {
          icon: isNowAllowed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4" />
        }
      );
    }
  };

  // Filter apps based on search query
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">App Control</h2>
          <p className="text-muted-foreground">
            {isInFocusSession 
              ? "Select which apps you want to access during focus time" 
              : "Manage which apps are allowed during focus sessions"}
          </p>
        </div>
        
        {isInFocusSession && (
          <Button 
            onClick={() => setIsAllowedAppsDialogOpen(true)} 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ShieldOff className="h-4 w-4 mr-1" />
            Allowed Apps
          </Button>
        )}
      </div>

      {!isInFocusSession && (
        <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && setActiveView(value as 'allowed' | 'blocked')} className="justify-start mb-4">
          <ToggleGroupItem value="allowed" className="text-xs">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Allowed Apps
          </ToggleGroupItem>
          <ToggleGroupItem value="blocked" className="text-xs">
            <Lock className="h-4 w-4 mr-1" />
            Blocked Apps
          </ToggleGroupItem>
        </ToggleGroup>
      )}

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

      {/* Search and refresh section */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={fetchInstalledApps}
          variant="outline"
          size="icon"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-focus" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredApps.map((app) => {
            const isAllowed = allowedApps.includes(app.packageName);
            
            // Only show apps based on selected view if not in focus session
            if (!isInFocusSession && 
                ((activeView === 'allowed' && !isAllowed) || 
                 (activeView === 'blocked' && isAllowed))) {
              return null;
            }
            
            return (
              <GlassCard 
                key={app.id} 
                className={cn(
                  "flex items-center gap-3 p-4",
                  (isAllowed) 
                    ? "border-green-500/20" 
                    : "border-transparent opacity-70"
                )}
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-accent/10 text-xl">
                  {app.icon}
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{app.name}</div>
                  <div className="text-xs text-muted-foreground">{app.packageName}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Switch 
                        checked={isAllowed} 
                        onCheckedChange={() => handleAllowedAppToggle(app.packageName)}
                        className={cn("mr-1", isAllowed ? "bg-green-500" : "")}
                      />
                      <span className="text-xs">
                        {isInFocusSession ? "Allow during focus" : "Allow during focus sessions"}
                      </span>
                    </div>
                    
                    {!isInFocusSession && activeView === 'blocked' && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <Switch 
                            checked={app.isBlocked} 
                            onCheckedChange={() => toggleAppBlock(app.id)}
                            className="mr-1"
                          />
                          <span className="text-xs">Block app</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Switch 
                            checked={app.blockNotifications} 
                            onCheckedChange={() => toggleNotificationBlock(app.id)}
                            className="mr-1"
                          />
                          <span className="text-xs">Block notifications</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {!isLoading && filteredApps.filter(app => {
        if (isInFocusSession) return true;
        return activeView === 'allowed' ? allowedApps.includes(app.packageName) : !allowedApps.includes(app.packageName);
      }).length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'No apps match your search' 
              : activeView === 'allowed' 
                ? 'No apps are currently allowed during focus' 
                : 'All apps are currently allowed during focus'}
          </p>
        </div>
      )}

      {/* Dialog for selecting allowed apps when focus session starts */}
      <Dialog open={isAllowedAppsDialogOpen} onOpenChange={(open) => {
        // Only allow closing if not in focus session
        if (!isInFocusSession || open) {
          setIsAllowedAppsDialogOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Apps to Allow During Focus</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-4">
              All apps are blocked by default during focus sessions. Select apps that you need to keep accessible:
            </p>
            <div className="space-y-3">
              {apps.map((app) => (
                <div key={app.packageName} className="flex items-center space-x-3">
                  <Checkbox 
                    id={app.packageName} 
                    checked={allowedApps.includes(app.packageName)}
                    onCheckedChange={() => handleAllowedAppToggle(app.packageName)}
                  />
                  <label htmlFor={app.packageName} className="font-medium text-sm cursor-pointer flex items-center">
                    <span className="mr-2">{app.icon}</span>
                    {app.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            {!isInFocusSession && (
              <Button variant="outline" onClick={() => setIsAllowedAppsDialogOpen(false)}>
                Close
              </Button>
            )}
            <Button onClick={() => setIsAllowedAppsDialogOpen(false)} className="bg-focus hover:bg-focus-dark text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button onClick={() => {}} className="bg-focus hover:bg-focus-dark text-white">
              Add App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppBlocker;
