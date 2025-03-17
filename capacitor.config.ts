
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ad0f3ad3e14b44178cff239183d9707a',
  appName: 'focus-gem-gatherer',
  webDir: 'dist',
  server: {
    url: 'https://ad0f3ad3-e14b-4417-8cff-239183d9707a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // Add notification control and app package info capabilities
    Permissions: {
      notifications: true,
      appPackageInfo: true
    }
  }
};

export default config;
