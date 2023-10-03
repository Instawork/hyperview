/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigatorService from 'hyperview/src/services/navigator';
import * as TypesLegacy from 'hyperview/src/types';
import { ComponentType, ReactNode } from 'react';
import type { Props as ErrorProps } from 'hyperview/src/core/components/load-error';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';
import type { RefreshControlProps } from 'react-native';
import type { StyleSheets } from 'hyperview/src/services/stylesheets';

/**
 * All of the props used by hv-screen
 */
export type Props = {
  formatDate: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  refreshControl?: ComponentType<RefreshControlProps>;
  navigation?: NavigatorService.NavigationProp;
  route?: NavigatorService.Route<string, { url?: string }>;
  entrypointUrl: string;
  fetch: (
    input: string,
    init: { headers: { [key: string]: unknown } },
  ) => Promise<Response>;
  onError?: (error: Error) => void;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  url?: string;
  back?: (params: TypesLegacy.NavigationRouteParams | undefined) => void;
  closeModal?: (params: TypesLegacy.NavigationRouteParams | undefined) => void;
  navigate?: (params: TypesLegacy.NavigationRouteParams, key: string) => void;
  openModal?: (params: TypesLegacy.NavigationRouteParams) => void;
  push?: (params: TypesLegacy.NavigationRouteParams) => void;
  behaviors?: TypesLegacy.HvBehavior[];
  components?: TypesLegacy.HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  doc?: Document;
  registerPreload?: (id: number, element: Element) => void;
};

export type State = {
  doc: Node | null;
  elementError: Error | null;
  error: Error | null;
  staleHeaderType: 'stale-if-error' | null | undefined;
  styles: StyleSheets | object | null;
  url: string | null;
};
