import type { HvComponentOnUpdate, RouteParams } from 'hyperview/src/types';
import { FC } from 'react';
import type { Props as HvRouteProps } from 'hyperview/src/elements/hv-route';
import { createCustomStackNavigator } from 'hyperview/src/core/components/navigator-stack';
import { createCustomTabNavigator } from 'hyperview/src/core/components/navigator-tab';

/**
 * Flag to show the default navigator UIs
 * Example: tab bar
 * NOTE: This will only be used if no footer element is provided for a tabbar
 */
export const SHOW_DEFAULT_FOOTER_UI = false;

/**
 * Flag to show the header UIs
 */
export const SHOW_DEFAULT_HEADER_UI = false;

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

export const Stack = createCustomStackNavigator<ParamTypes>();
export const BottomTab = createCustomTabNavigator<ParamTypes>();
