export default {
  android: {
    adaptiveIcon: {
      backgroundColor: '#000000',
      foregroundImage: './assets/icon.png',
    },
    package: 'org.hyperview.demo',
    usesCleartextTraffic: true,
  },
  assetBundlePatterns: ['**/*'],
  extra: {
    baseUrl: process.env.BASE_URL || 'http://127.0.0.1:8085',
  },
  icon: './assets/icon.png',
  ios: {
    bundleIdentifier: 'org.hyperview.demo',
    infoPlist: {
      CFBundleDisplayName: 'Hyperview',
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
    supportsTablet: true,
  },
  name: 'Hyperview',
  newArchEnabled: true,
  orientation: 'portrait',
  scheme: 'hyperview',
  slug: 'demo',
  splash: {
    backgroundColor: '#ffffff',
    image: './assets/splash.png',
    resizeMode: 'contain',
  },
  userInterfaceStyle: 'light',
  version: '1.0.0',
  web: {
    favicon: './assets/favicon.png',
  },
};
