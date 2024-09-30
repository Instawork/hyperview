import type { HvComponentOnUpdate, RouteParams } from 'hyperview/src/types';
import { FC } from 'react';
import type { Props as HvRouteProps } from 'hyperview/src/core/components/hv-route';

export type ParamTypes = Record<string, RouteParams>;

export type ScreenParams = {
  params: RouteParams;
};

export type NavigatorParams = {
  route: ScreenParams;
};

/**
 * All of the props used by hv-navigator
 */
export type Props = {
  element?: Element;
  onUpdate: HvComponentOnUpdate;
  params?: RouteParams;
  routeComponent: FC<HvRouteProps>;
};

/**
 * Options used for a stack navigator's screenOptions
 */
export type StackScreenOptions = {
  headerMode: 'float' | 'screen' | undefined;
  title: string | undefined;
};

/**
 * Options used for a tab navigator's screenOptions
 */
export type TabScreenOptions = {
  headerShown: boolean;
  tabBarStyle: { display: 'flex' | 'none' | undefined };
  title: string | undefined;
};
