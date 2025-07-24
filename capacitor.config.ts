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
      // androidClientId: '13685315862-qpqk32jbh4f570i6oq44ol0ojnb1b241.apps.googleusercontent.com', 
      forceCodeForRefreshToken: true
    }
  }
};

export default config;