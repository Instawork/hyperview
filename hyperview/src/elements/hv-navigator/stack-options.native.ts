import type { StackRouteOptions, StackRouteOptionsParams } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

export const getStackRouteOptions = ({
  isFirstScreen,
  usesModalPresentation,
}: StackRouteOptionsParams): StackRouteOptions => {
  const routeAnimation: NativeStackNavigationOptions['animation'] = usesModalPresentation
    ? 'slide_from_bottom'
    : 'default';
  return {
    animation: isFirstScreen ? 'none' : routeAnimation,
    gestureEnabled: Platform.OS === 'ios' && !usesModalPresentation,
    // Use a bottom-up card until native modal dismissal can safely overlap a push:
    // https://github.com/software-mansion/react-native-screens/issues/4446
    presentation: 'card',
  };
};
