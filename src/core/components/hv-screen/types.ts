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
import type { RefreshControlProps } from 'react-native';

/**
 * Props required by contexts <see>hyperview/src/contexts/navigation.ts</see>
 */
export type ContextProps = {
  formatDate: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  refreshControl?: ComponentType<RefreshControlProps>;
};

/**
 * The navigation prop used by react-navigation
 */
// *** AHG TODO GET RIGHT TYPE
export type RNTypedNavigationProps = NavigatorService.NavigationProp<object>;

/**
 * The route prop used by react-navigation
 */
export type RouteProps = NavigatorService.Route<string, { url?: string }>;

/**
 * Props used by navigation components
 * Route contains the type of the params object
 */
export type NavigationProps = {
  navigation?: RNTypedNavigationProps;
  route?: RouteProps;
};

/**
 * Props used for data fetching
 */
export type DataProps = {
  entrypointUrl: string;
  fetch: (
    input: string,
    init: { headers: { [key: string]: unknown } },
  ) => Promise<Response>;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  url?: string;
};

/**
 * Props used by legacy external navigation components
 */
export type ActionProps = {
  back?: (params: object) => void;
  closeModal?: (params: object) => void;
  navigate?: (params: object, key: string) => void;
  openModal?: (params: object) => void;
  push?: (params: object) => void;
};

/**
 * Props used for passing content
 */
export type ContentProps = {
  doc?: TypesLegacy.Document;
};

/**
 * Props used just by hv-screen
 */
export type ComponentProps = {
  behaviors?: TypesLegacy.HvBehavior[];
  components?: TypesLegacy.HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
};

/**
 * All of the props used by hv-screen
 */
export type Props = ContextProps &
  NavigationProps &
  DataProps &
  ActionProps &
  ComponentProps &
  ContentProps;
