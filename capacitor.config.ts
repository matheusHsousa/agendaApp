import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'agendaApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: '13685315862-fet1m22552gpm73ljknnui25op7ckf5d.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
