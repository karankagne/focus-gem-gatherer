import { Capacitor, registerPlugin } from '@capacitor/core';

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

const NotificationBlockerWeb = {
  blockAppNotifications: async ({ packageName }: { packageName: string }): Promise<{ success: boolean }> => {
    console.log(`[Web Mock] Blocking notifications for: ${packageName}`);
    return { success: true };
  },
  
  unblockAppNotifications: async ({ packageName }: { packageName: string }): Promise<{ success: boolean }> => {
    console.log(`[Web Mock] Unblocking notifications for: ${packageName}`);
    return { success: true };
  },
  
  checkNotificationPermission: async (): Promise<{ hasPermission: boolean }> => {
    console.log('[Web Mock] Checking notification permission');
    // For web, check if notification permission is granted
    if ('Notification' in window) {
      return { hasPermission: Notification.permission === 'granted' };
    }
    return { hasPermission: false };
  },
  
  requestNotificationPermission: async (): Promise<{ granted: boolean }> => {
    console.log('[Web Mock] Requesting notification permission');
    
    // For web, use the Notification API
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return { granted: permission === 'granted' };
    }
    
    return { granted: false };
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

// Register the plugin using Capacitor's plugin system
const NotificationBlocker = Capacitor.isNativePlatform()
  ? registerPlugin<NotificationBlockerPlugin>('NotificationBlocker')
  : NotificationBlockerWeb;

export default NotificationBlocker;
