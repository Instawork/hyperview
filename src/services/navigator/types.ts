/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';

export const ANCHOR_ID_SEPARATOR = '#';
export const ID_CARD = 'card';
export const ID_MODAL = 'modal';
export const KEY_MERGE = 'merge';
export const KEY_SELECTED = 'selected';
export const KEY_MODAL = 'modal';

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
  params?: NavigationNavigateParams | TypesLegacy.NavigationRouteParams;
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
  addListener: (event: string, callback: () => void) => void;
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
  [key: string]: TypesLegacy.Element;
};
