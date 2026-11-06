import * as NavigatorService from 'hyperview/src/services/navigator';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack';
import type {
  GetRouteId,
  ScreenOptionsProps,
  StackRouteOptionsParams,
  StackScreenOptions,
} from './types';
import { Platform } from 'react-native';
import { SHOW_DEFAULT_HEADER_UI } from './types';

export const getStackScreenOptions = (
  { route }: ScreenOptionsProps,
  getId: GetRouteId,
): StackScreenOptions => ({
  headerMode: 'screen',
  headerShown: SHOW_DEFAULT_HEADER_UI,
  title: getId(route.params),
});

export const getStackRouteOptions = ({
  isFirstScreen,
  usesModalPresentation,
}: StackRouteOptionsParams): StackNavigationOptions => {
  let cardStyleInterpolator;
  if (usesModalPresentation) {
    cardStyleInterpolator =
      Platform.OS === 'android'
        ? CardStyleInterpolators.forBottomSheetAndroid
        : CardStyleInterpolators.forVerticalIOS;
  }
  return {
    animation: isFirstScreen ? 'none' : 'default',
    cardStyleInterpolator,
    gestureEnabled: Platform.OS === 'ios' ? !usesModalPresentation : false,
    presentation: usesModalPresentation
      ? NavigatorService.ID_MODAL
      : NavigatorService.ID_CARD,
  };
};
