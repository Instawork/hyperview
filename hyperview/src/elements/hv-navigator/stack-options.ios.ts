import type {
  GetRouteId,
  ScreenOptionsProps,
  StackRouteOptionsParams,
  StackScreenOptions,
} from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { SHOW_DEFAULT_HEADER_UI } from './types';

export const getStackScreenOptions = (
  { route }: ScreenOptionsProps,
  getId: GetRouteId,
): NativeStackNavigationOptions &
  Pick<StackScreenOptions, 'headerShown' | 'title'> => ({
  headerShown: SHOW_DEFAULT_HEADER_UI,
  title: getId(route.params),
});

export const getStackRouteOptions = ({
  isFirstScreen,
  usesModalPresentation,
}: StackRouteOptionsParams): NativeStackNavigationOptions => {
  let animation: NativeStackNavigationOptions['animation'] = 'default';
  if (isFirstScreen) {
    animation = 'none';
  } else if (usesModalPresentation) {
    animation = 'slide_from_bottom';
  }
  return {
    animation,
    gestureEnabled: !usesModalPresentation,
    presentation: 'card',
  };
};
