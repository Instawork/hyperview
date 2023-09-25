/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import {
  // StackNavigationEventMap,
  StackNavigationOptions,
} from '@react-navigation/stack';

export type Props = {
  id: string;
  // backBehavior?: 'none' | 'initialRoute' | 'history' | 'order';
  children?: React.ReactNode;
  initialRouteName?: string;
  screenOptions?: StackNavigationOptions;
  // screenListeners?: StackNavigationEventMap;
};

export type ParamListBase = Record<string, object | undefined>;

export type RouterConfigOptions = {
  routeNames: string[];
  routeParamList: Record<string, object | undefined>;
  routeGetIdList: Record<
    string,
    | ((options: { params?: Record<string, unknown> }) => string | undefined)
    | undefined
  >;
};

export type RouterRenameOptions = RouterConfigOptions & {
  routeKeyChanges: string[];
};

export type StackOptions = {
  id?: string;
  initialRouteName?: string;
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

export type EventMapBase = {
  data?: any;
};
