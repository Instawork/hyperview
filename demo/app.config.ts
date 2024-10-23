export default {
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
      foregroundImage: './assets/adaptive-icon.png',
    },
  },
  assetBundlePatterns: ['**/*'],
  extra: {
    baseUrl: process.env.BASE_URL || 'http://0.0.0.0:8085',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '', // Leaving the key empty will enable dev-only experience
  },
  icon: './assets/icon.png',
  ios: {
    supportsTablet: true,
  },
  name: 'demo',
  orientation: 'portrait',
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
