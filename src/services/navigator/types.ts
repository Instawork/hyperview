import type { NavigationRouteParams } from 'hyperview/src/types';

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

/**
 * Mapping of screens and params for navigation
 */
export type NavigationNavigateParams = {
  screen?: string;
  params?: NavigationNavigateParams | NavigationRouteParams;
};

/**
 * Minimal representation of the 'NavigationProp' used by react-navigation
 */
export type NavigationProp = {
  navigate: (options: object) => void;
  dispatch: (options: object) => void;
  goBack: () => void;
  getState: () => NavigationState;
  getParent: (id?: string) => NavigationProp | undefined;
  addListener: (
    eventName: string,
    callback: (event: { preventDefault: () => void }) => void,
  ) => () => void;
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
