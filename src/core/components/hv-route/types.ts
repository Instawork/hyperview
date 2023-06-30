/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigatorService from 'hyperview/src/services/navigator';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import { ComponentType, ReactNode } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';

/**
 * Params passed to hv-route
 */
type RouteParams = {
  id?: string;
  url: string;
};

/**
 * The navigation prop used by react-navigation
 */
export type RNTypedNavigationProps = NavigatorService.NavigationProp<object>;

export type NavigationContextProps = {
  entrypointUrl: string;
  fetch: (
    input: string,
    init: { headers: { [key: string]: unknown } },
  ) => Promise<Response>;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  url?: string;
  behaviors?: TypesLegacy.HvBehavior[];
  components?: TypesLegacy.HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
};

export type NavigatorContextProps = {
  routeMap?: Map<string, string>;
  elementMap?: Map<string, TypesLegacy.Element>;
  initialRouteName?: string;
};

export type State = {
  doc?: TypesLegacy.Document;
  error?: Error;
};

/**
 * The route prop used by react-navigation
 */
export type RouteProps = NavigatorService.Route<string, { url?: string }>;

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = {
  id?: string;
  url: string;
  navigation?: RNTypedNavigationProps;
  route?: NavigatorService.Route<string, RouteParams>;
  entrypointUrl: string;
  fetch: (
    input: string,
    init: { headers: { [key: string]: unknown } },
  ) => Promise<Response>;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  behaviors?: TypesLegacy.HvBehavior[];
  components?: TypesLegacy.HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  routeMap?: Map<string, string>;
  elementMap?: Map<string, TypesLegacy.Element>;
  initialRouteName?: string;
  element?: TypesLegacy.Element;
};

/**
 * All of the props used by hv-route
 */
export type Props = {
  navigation?: RNTypedNavigationProps;
  route?: NavigatorService.Route<string, RouteParams>;
};
