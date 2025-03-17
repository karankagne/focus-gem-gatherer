
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ad0f3ad3e14b44178cff239183d9707a',
  appName: 'focus-gem-gatherer',
  webDir: 'dist',
  server: {
    // Use localhost for development
    androidScheme: 'https',
    allowNavigation: ['*'],
    cleartext: true
  },
  plugins: {
    // Add notification control and app package info capabilities
    Permissions: {
      notifications: true,
      appPackageInfo: true
    }
  },
  android: {
    path: 'android'
  }
};

export default config;
