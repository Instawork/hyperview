/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types';
import { FC } from 'react';

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
  element: TypesLegacy.Element;
  routeComponent: FC;
};
