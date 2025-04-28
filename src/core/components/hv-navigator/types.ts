import type { HvComponentOnUpdate, RouteParams } from 'hyperview/src/types';
import { FC } from 'react';
import type { HeaderComponent } from 'hyperview/src/services/navigator';
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
  header: HeaderComponent | undefined;
  headerMode: 'float' | 'screen' | undefined;
  headerShown?: boolean;
  title: string | undefined;
};

/**
 * Options used for a tab navigator's screenOptions
 */
export type TabScreenOptions = {
  header: HeaderComponent | undefined;
  headerShown?: boolean;
  tabBarStyle: { display: 'flex' | 'none' | undefined };
  title: string | undefined;
};
