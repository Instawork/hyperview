/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';

export const ANCHOR_ID_SEPARATOR = '#';
export const ID_DYNAMIC = 'dynamic';
export const ID_MODAL = 'modal';

/**
 * Definition of the available navigator types
 */
export const NAVIGATOR_TYPE = {
  STACK: 'stack',
  TAB: 'tab',
};

/**
 * Mapping of screens and params for navigation
 */
export type NavigationNavigateParams = {
  screen?: string;
  params?: NavigationNavigateParams | TypesLegacy.NavigationRouteParams;
};
