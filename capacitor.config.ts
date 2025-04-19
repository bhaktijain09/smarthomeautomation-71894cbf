<<<<<<< HEAD

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7efd455f41fa40e1898f068eec02e30b',
  appName: 'smarthomeautomation',
  webDir: 'dist',
  server: {
    url: 'https://7efd455f-41fa-40e1-898f-068eec02e30b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
=======
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.SmartHomeAutomationapp',
  appName: 'SmartHomeAutomationapp',
  webDir: 'dist'
>>>>>>> ea0f423 (Fix: remove invalid JSX from DeviceCard component)
};

export default config;
