import * as NavigatorService from 'hyperview/src/services/navigator';
import type { StackRouteOptions, StackRouteOptionsParams } from './types';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Platform } from 'react-native';

export const getStackRouteOptions = ({
  isFirstScreen,
  usesModalPresentation,
}: StackRouteOptionsParams): StackRouteOptions => {
  const modalCardStyleInterpolator =
    Platform.OS === 'android'
      ? CardStyleInterpolators.forBottomSheetAndroid
      : CardStyleInterpolators.forVerticalIOS;
  return {
    animation: isFirstScreen ? 'none' : 'default',
    cardStyleInterpolator: usesModalPresentation
      ? modalCardStyleInterpolator
      : undefined,
    gestureEnabled: Platform.OS === 'ios' && !usesModalPresentation,
    presentation: usesModalPresentation
      ? NavigatorService.ID_MODAL
      : NavigatorService.ID_CARD,
  };
};
