import * as Contexts from 'hyperview/src/contexts';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';

export type Props = {
  id: string;
  children?: React.ReactNode;
  initialRouteName?: string;
  screenOptions?: StackNavigationOptions;
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
  docContextProps: Contexts.DocContextProps | null;
  id: string;
  initialRouteName?: string;
  navContextProps: NavigationContext.NavigationContextProps | null;
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
type Route<
  RouteName extends string,
  Params extends object | undefined = object | undefined
> = {
  key: string;
  name: RouteName;
  params: Params;
  state?: NavigationState;
};

export type EventMapBase = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};
