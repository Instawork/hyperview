/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FC } from 'react';
import type { Props as HvRouteProps } from 'hyperview/src/core/components/hv-route';

export type RouteParams = {
  id?: string;
  url: string;
};

export type ParamTypes = {
  dynamic: RouteParams;
  modal: RouteParams;
};

export type ScreenParams = {
  params: RouteParams;
};

export type NavigatorParams = {
  route: ScreenParams;
};

/**
 * All of the props used by hv-navigator
 */
export type Props = {
  element: Element;
  routeComponent: FC<HvRouteProps>;
};
