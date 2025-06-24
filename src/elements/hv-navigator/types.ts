import type { HvComponentOnUpdate, RouteParams } from 'hyperview/src/types';
import { FC } from 'react';
import type { Props as HvRouteProps } from 'hyperview/src/elements/hv-route';

export type ParamTypes = Record<string, RouteParams>;

export type ScreenParams = {
  params: RouteParams;
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

/* List of props available to navigators */
export type NavigatorProps = {
  doc: Document | undefined;
};

/**
 * Options used for a stack navigator's screenOptions
 */
export type StackScreenOptions = {
  headerMode: 'float' | 'screen' | undefined;
  headerShown: boolean;
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
