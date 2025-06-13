import type { NavigationRouteParams, RouteParams } from 'hyperview/src/types';
import { NavigationContainerRefContext } from '@react-navigation/native';
import type { BottomTabBarProps as RNBottomTabBarProps } from '@react-navigation/bottom-tabs';

export const ANCHOR_ID_SEPARATOR = '#';
export const ID_CARD = 'card';
export const ID_MODAL = 'modal';
export const KEY_MERGE = 'merge';
export const KEY_SELECTED = 'selected';
export const KEY_MODAL = 'modal';
export const KEY_ID = 'id';
export const KEY_TYPE = 'type';
export const KEY_HREF = 'href';

/**
 * Definition of the available navigator types
 */
export const NAVIGATOR_TYPE = {
  STACK: 'stack',
  TAB: 'tab',
};

export type Props = {
  navigation?: NavigationProp;
  route?: Route<string, RouteParams>;
  entrypointUrl: string;
  rootNavigation?:
    | React.ContextType<typeof NavigationContainerRefContext>
    | undefined;
  setElement: (key: number, element: Element) => void;
};

/**
 * Mapping of screens and params for navigation
 */
export type NavigationNavigateParams = {
  screen?: string;
  params?: NavigationNavigateParams | NavigationRouteParams;
};

export type ListenerEvent = {
  data: { state: NavigationState | undefined } | undefined;
  preventDefault: () => void;
};

type ListenerCallback = (event: ListenerEvent) => void;

/**
 * Minimal representation of the 'NavigationProp' used by react-navigation
 */
export type NavigationProp = {
  navigate: (options: object) => void;
  dispatch: (options: object) => void;
  goBack: () => void;
  getState: () => NavigationState;
  getParent: (id?: string) => NavigationProp | undefined;
  addListener: (eventName: string, callback: ListenerCallback) => () => void;
  isFocused: () => boolean;
};

/**
 * Minimal representation of the 'Route' used by react-navigation
 */
export type Route<
  RouteName extends string,
  Params extends object | undefined = object | undefined
> = {
  key: string;
  name: RouteName;
  params: Params;
  state?: NavigationState;
};

type BottomTabBarProps = RNBottomTabBarProps & {
  id: string;
};

type BottomTabBarComponent = (props: BottomTabBarProps) => JSX.Element | null;

export type NavigationComponents = {
  BottomTabBar?: BottomTabBarComponent;
};

/* List of props available to navigators */
export type NavigatorProps = NavigationComponents & {
  doc: Document | undefined;
};

/**
 * Minimal representation of the 'NavigationState' used by react-navigation
 */
export type NavigationState = {
  index: number;
  key: string;
  routeNames: string[];
  routes: Route<string, object>[];
  stale: false;
  type: string;
  history?: unknown[];
};

/**
 * Type defining a map of <id, element>
 */
export type RouteMap = {
  [key: string]: Element;
};
