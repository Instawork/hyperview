const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

if (process.env.HYPERVIEW_DEMO_STACK === 'stack') {
  const stackModules = {
    'hyperview/src/components/navigator-stack':
      '../hyperview/src/components/navigator-stack/index.tsx',
    'hyperview/src/elements/hv-navigator/stack-options':
      '../hyperview/src/elements/hv-navigator/stack-options.ts',
  };

  config.resolver.resolveRequest = (context, moduleName, platform) => {
    const stackModule = stackModules[moduleName];
    if (stackModule) {
      return {
        filePath: path.resolve(__dirname, stackModule),
        type: 'sourceFile',
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  };
}

module.exports = config;
