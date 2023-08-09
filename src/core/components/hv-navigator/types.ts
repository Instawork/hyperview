/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';
import { FC } from 'react';

export type RouteParams = {
  id?: string;
  url: string;
  isModal?: boolean;
};

export type ParamTypes = Record<string, RouteParams>;

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

/**
 * Options used for a stack navigator's screenOptions
 */
export type StackScreenOptions = {
  headerMode: 'float' | 'screen' | undefined;
  headerShown: boolean;
  title: string | undefined;
};
