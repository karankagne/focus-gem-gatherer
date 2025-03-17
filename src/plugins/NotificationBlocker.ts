
import { Capacitor } from '@capacitor/core';

export interface InstalledApp {
  packageName: string;
  appName: string;
  icon?: string; // Base64 encoded icon (for native platforms)
}

export interface NotificationBlockerPlugin {
  blockAppNotifications(options: { packageName: string }): Promise<{ success: boolean }>;
  unblockAppNotifications(options: { packageName: string }): Promise<{ success: boolean }>;
  checkNotificationPermission(): Promise<{ hasPermission: boolean }>;
  requestNotificationPermission(): Promise<{ granted: boolean }>;
  getInstalledApps(): Promise<{ apps: InstalledApp[] }>;
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
  },
  
  getInstalledApps: async (): Promise<{ apps: InstalledApp[] }> => {
    console.log('[Web Mock] Getting installed apps');
    // Return mock data for web environment
    const mockApps: InstalledApp[] = [
      { packageName: 'com.instagram.android', appName: 'Instagram', icon: '📱' },
      { packageName: 'com.tiktok.android', appName: 'TikTok', icon: '📱' },
      { packageName: 'com.google.android.youtube', appName: 'YouTube', icon: '📱' },
      { packageName: 'com.twitter.android', appName: 'Twitter', icon: '📱' },
      { packageName: 'com.facebook.katana', appName: 'Facebook', icon: '📱' },
      { packageName: 'com.whatsapp', appName: 'WhatsApp', icon: '📱' },
      { packageName: 'com.spotify.music', appName: 'Spotify', icon: '📱' },
      { packageName: 'com.netflix.mediaclient', appName: 'Netflix', icon: '📱' },
    ];
    return { apps: mockApps };
  }
};

export default NotificationBlocker;
