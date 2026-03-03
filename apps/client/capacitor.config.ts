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
      androidClientId: '399934829057-9rlehsblaukd4p0fa00m344n3p3othg1.apps.googleusercontent.com',
      forceCodeForRefreshToken: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#0a0a0f',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
