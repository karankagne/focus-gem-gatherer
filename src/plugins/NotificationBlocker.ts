
import { Capacitor } from '@capacitor/core';

export interface NotificationBlockerPlugin {
  blockAppNotifications(options: { packageName: string }): Promise<{ success: boolean }>;
  unblockAppNotifications(options: { packageName: string }): Promise<{ success: boolean }>;
  checkNotificationPermission(): Promise<{ hasPermission: boolean }>;
  requestNotificationPermission(): Promise<{ granted: boolean }>;
}

// This is a mock implementation for web
const NotificationBlocker = {
  blockAppNotifications: async ({ packageName }: { packageName: string }): Promise<{ success: boolean }> => {
    console.log(`[Web Mock] Blocking notifications for: ${packageName}`);
    return { success: Capacitor.isNativePlatform() ? false : true };
  },
  
  unblockAppNotifications: async ({ packageName }: { packageName: string }): Promise<{ success: boolean }> => {
    console.log(`[Web Mock] Unblocking notifications for: ${packageName}`);
    return { success: Capacitor.isNativePlatform() ? false : true };
  },
  
  checkNotificationPermission: async (): Promise<{ hasPermission: boolean }> => {
    console.log('[Web Mock] Checking notification permission');
    return { hasPermission: Capacitor.isNativePlatform() ? false : true };
  },
  
  requestNotificationPermission: async (): Promise<{ granted: boolean }> => {
    console.log('[Web Mock] Requesting notification permission');
    return { granted: Capacitor.isNativePlatform() ? false : true };
  }
};

export default NotificationBlocker;
