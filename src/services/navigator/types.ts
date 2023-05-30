/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NavigationRouteParams } from '../../types-legacy';
import { NavigatorScreenParams } from './imports';

export const ANCHOR_ID_SEPARATOR = '#';
export const ID_DYNAMIC = 'dynamic';
export const ID_MODAL = 'modal';

/**
 * Definition of the available navigator types
 */
export const NAVIGATOR_TYPE = {
  BOTTOM_TAB: 'bottom-tab',
  STACK: 'stack',
  TOP_TAB: 'top-tab',
};

/**
 * Mapping of screens and params for navigation
 */
export type NavigationNavigateParams = NavigatorScreenParams<NavigationRouteParams>;
