/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigatorService from 'hyperview/src/services/navigator';
import { ComponentType, ReactNode } from 'react';
import {
  Fetch,
  HvBehavior,
  HvComponent,
  HvComponentOnUpdate,
  Reload,
} from 'hyperview/src/types';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';

export type NavigationContextProps = {
  entrypointUrl: string;
  fetch: Fetch;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  onRouteBlur?: (id?: string, url?: string) => void;
  onRouteFocus?: (id?: string, url?: string) => void;
  onUpdate: HvComponentOnUpdate;
  url?: string;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  reload: Reload;
};

export type NavigatorMapContextProps = {
  setPreload: (key: number, element: Element) => void;
  getPreload: (key: number) => Element | undefined;
};

/**
 * The route prop used by react-navigation
 */
export type RouteProps = NavigatorService.Route<string, { url?: string }>;

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = {
  url?: string;
  navigation?: NavigatorService.NavigationProp;
  route?: NavigatorService.Route<string, RouteParams>;
  entrypointUrl: string;
  fetch: Fetch;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  onUpdate: HvComponentOnUpdate;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  setPreload: (key: number, element: Element) => void;
  getPreload: (key: number) => Element | undefined;
  element?: Element;
  reload: Reload;
};

/**
 * All of the props used by hv-route
 */
export type Props = {
  navigation?: NavigatorService.NavigationProp;
  route?: NavigatorService.Route<string, RouteParams>;
};
