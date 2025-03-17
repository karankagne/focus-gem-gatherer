import { useEffect, useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Capacitor } from '@capacitor/core';
import NotificationBlocker from '../../plugins/NotificationBlocker';

export const PermissionRequest = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're running on a native platform
    if (Capacitor.isNativePlatform()) {
      // Check if permission was already granted
      checkPermissionStatus();
    }
  }, []);

  const checkPermissionStatus = async () => {
    try {
      console.log('Checking notification permission status...');
      const { hasPermission } = await NotificationBlocker.checkNotificationPermission();
      
      console.log('Permission status:', hasPermission ? 'Granted' : 'Not granted');
      
      // If permission not granted, show the dialog
      if (!hasPermission) {
        setOpen(true);
      }
    } catch (error: any) {
      console.error('Error checking permission:', error);
      setError(`Error checking permission: ${error.message || 'Unknown error'}`);
      // Still show the dialog if there's an error checking
      setOpen(true);
    }
  };

  const requestPermissions = async () => {
    try {
      console.log('Requesting notification permission...');
      
      // For development on web, mock the response
      if (!Capacitor.isNativePlatform()) {
        console.log('Web environment, mocking success response');
        toast.success('Permissions granted! (Web mock)');
        setOpen(false);
        return;
      }
      
      const { granted } = await NotificationBlocker.requestNotificationPermission();
      
      console.log('Permission request result:', granted ? 'Granted' : 'Denied');
      
      if (granted) {
        toast.success('Permissions granted! The app will work seamlessly.');
      } else {
        toast.warning('Permission denied. You can enable it later in app settings.');
      }
      
      setOpen(false);
    } catch (error: any) {
      console.error('Error requesting permissions:', error);
      const errorMessage = error.message || 'Unknown error';
      setError(`Failed to request permissions: ${errorMessage}`);
      toast.error(`Error requesting permissions: ${errorMessage}`);
      
      // Keep dialog open if there's an error
      // User can try again or cancel
    }
  };

  const handleCancel = () => {
    toast.warning('The app may not function properly without required permissions.');
    setOpen(false);
  };

  const openAppSettings = async () => {
    // For Android, we can at least attempt to open settings
    try {
      if (Capacitor.getPlatform() === 'android') {
        // We'll open app settings, not the specific notification settings
        if (Capacitor.isPluginAvailable('App')) {
          const { App } = await import('@capacitor/app');
          // Use the correct method to open app settings
          await App.openSettings();
        }
      }
    } catch (err) {
      console.error('Failed to open settings:', err);
    }
    
    toast.info('Please open app settings and enable notifications for Focus Gem Gatherer');
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>App Permissions Required</AlertDialogTitle>
          <AlertDialogDescription>
            {error ? (
              <div className="text-red-500 mb-2">{error}</div>
            ) : (
              <div>
                Focus Gem Gatherer needs notification access to help you stay focused and manage distractions.
                This will allow the app to block notifications from distracting apps during focus sessions.
                
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                  <p className="font-medium">Important:</p>
                  <p>You will be asked to grant notification listener permission. This is necessary for blocking notifications from other apps.</p>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Not Now</AlertDialogCancel>
          {error ? (
            <AlertDialogAction onClick={openAppSettings}>Open Settings</AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={requestPermissions}>Grant Permissions</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PermissionRequest;
