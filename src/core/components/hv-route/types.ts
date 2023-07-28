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
  preloadScreen?: number;
  parentId?: string;
};

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

export type NavigatorMapContextProps = {
  getRoute: (key: string) => string | undefined;
  getElement: (key: string) => TypesLegacy.Element | undefined;
  setPreload: (key: number, element: TypesLegacy.Element) => void;
  getPreload: (key: number) => TypesLegacy.Element | undefined;
  initialRouteName?: string;
};

export type State = {
  doc?: TypesLegacy.Document;
  error?: Error;
  navigator?: TypesLegacy.Element;
  root?: TypesLegacy.Element;
  screen?: TypesLegacy.Element;
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
  navigation?: NavigatorService.NavigationProp;
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
  getRoute: (key: string) => string | undefined;
  getElement: (key: string) => TypesLegacy.Element | undefined;
  setPreload: (key: number, element: TypesLegacy.Element) => void;
  getPreload: (key: number) => TypesLegacy.Element | undefined;
  initialRouteName?: string;
  element?: TypesLegacy.Element;
};

/**
 * All of the props used by hv-route
 */
export type Props = {
  navigation?: NavigatorService.NavigationProp;
  route?: NavigatorService.Route<string, RouteParams>;
};
