export default {
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
      foregroundImage: './assets/adaptive-icon.png',
    },
  },
  assetBundlePatterns: ['**/*'],
  extra: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    baseUrl: process.env.BASE_URL,
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
