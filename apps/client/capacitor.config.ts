import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zophiel.app',
  appName: 'Zophiel',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#6366f1',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '399934829057-ion4sr02mpnftbd3kssju2e63jg4c4s4.apps.googleusercontent.com',
      forceCodeForRefreshToken: false,
    },
  },
};

export default config;
