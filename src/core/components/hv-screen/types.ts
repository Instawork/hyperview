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
 * All of the props used by hv-screen
 */
export type Props = {
  formatDate: (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined;
  refreshControl?: ComponentType<RefreshControlProps>;
  navigation?: NavigatorService.NavigationProp<object>;
  route?: NavigatorService.Route<string, { url?: string }>;
  entrypointUrl: string;
  fetch: (
    input: string,
    init: { headers: { [key: string]: unknown } },
  ) => Promise<Response>;
  onParseAfter?: (url: string) => void;
  onParseBefore?: (url: string) => void;
  url?: string;
  back?: (
    params: TypesLegacy.NavigationRouteParams | object | undefined,
  ) => void;
  closeModal?: (
    params: TypesLegacy.NavigationRouteParams | object | undefined,
  ) => void;
  navigate?: (
    params: TypesLegacy.NavigationRouteParams | object,
    key: string,
  ) => void;
  openModal?: (params: TypesLegacy.NavigationRouteParams | object) => void;
  push?: (params: object) => void;
  behaviors?: TypesLegacy.HvBehavior[];
  components?: TypesLegacy.HvComponent[];
  elementErrorComponent?: ComponentType<ErrorProps>;
  errorScreen?: ComponentType<ErrorProps>;
  loadingScreen?: ComponentType<LoadingProps>;
  handleBack?: ComponentType<{ children: ReactNode }>;
  doc?: TypesLegacy.Document;
  registerPreload?: (id: number, element: TypesLegacy.Element) => void;
};
