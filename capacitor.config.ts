import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.joe.workprogress',
  appName: 'Work Progress Monitor',
  webDir: 'public',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'workprogress'
  }
};

export default config;