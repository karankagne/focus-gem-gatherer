
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

  useEffect(() => {
    // Check if we're running on a native platform
    if (Capacitor.isNativePlatform()) {
      // Check if permission was already granted
      checkPermissionStatus();
    }
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const { hasPermission } = await NotificationBlocker.checkNotificationPermission();
      
      // If permission not granted, show the dialog
      if (!hasPermission) {
        setOpen(true);
      }
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const { granted } = await NotificationBlocker.requestNotificationPermission();
      
      if (granted) {
        toast.success('Permissions granted! The app will work seamlessly.');
      } else {
        toast.error('Some permissions were denied. You may not experience full functionality.');
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast.error('There was an error requesting permissions.');
      setOpen(false);
    }
  };

  const handleCancel = () => {
    toast.warning('The app may not function properly without required permissions.');
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>App Permissions Required</AlertDialogTitle>
          <AlertDialogDescription>
            Focus Gem Gatherer needs notification access to help you stay focused and manage distractions.
            This will allow the app to block notifications from distracting apps during focus sessions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Not Now</AlertDialogCancel>
          <AlertDialogAction onClick={requestPermissions}>Grant Permissions</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PermissionRequest;
