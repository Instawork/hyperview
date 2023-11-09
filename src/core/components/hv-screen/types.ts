/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigatorService from 'hyperview/src/services/navigator';
import { ComponentType, ReactNode } from 'react';
import type {
  Fetch,
  HvBehavior,
  HvComponent,
  HvComponentOnUpdate,
  NavigationRouteParams,
  Reload,
  Route,
} from 'hyperview/src/types';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';
import type { RefreshControlProps } from 'react-native';

/**
 * All of the props used by hv-screen
 */
export type Props = {
  formatDate: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  refreshControl?: ComponentType<RefreshControlProps>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: any;
  route?: NavigatorService.Route<string, { url?: string }>;
  entrypointUrl: string;
  fetch: Fetch;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  onRouteBlur?: (route: Route) => void;
  onRouteFocus?: (route: Route) => void;
  onUpdate: HvComponentOnUpdate;
  url?: string;
  back?: (params: NavigationRouteParams | object | undefined) => void;
  closeModal?: (params: NavigationRouteParams | object | undefined) => void;
  navigate?: (params: NavigationRouteParams | object, key: string) => void;
  openModal?: (params: NavigationRouteParams | object) => void;
  push?: (params: object) => void;
  behaviors?: HvBehavior[];
  components?: HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  doc?: Document;
  registerPreload?: (id: number, element: Element) => void;
  reload: Reload;
};
