import { Platform } from 'react-native';

export const isLiquidGlassSupported = (
  platformOS = Platform.OS,
  platformVersion = Platform.Version,
) => platformOS === 'ios' && Number(platformVersion) >= 26;
