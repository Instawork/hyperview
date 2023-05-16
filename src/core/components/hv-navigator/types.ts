/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as HvScreenProps from 'hyperview/src/core/components/hv-screen/types';
import React from 'react';

/**
 * Props used by hv-navigator
 */
export type ComponentProps = {
  handleBack: React.ComponentType;
  element?: Element;
};

/**
 * All of the props used by hv-navigator
 */
export type Props = HvScreenProps.NavigationProps &
  HvScreenProps.DataProps &
  HvScreenProps.ComponentProps &
  ComponentProps;

/**
 * Minimal local name type copy from 'hyperview/src/types.js'
 */
export const LOCAL_NAME = {
  DOC: 'doc',
  HEADER: 'header',
  NAV_ROUTE: 'nav-route',
  NAVIGATOR: 'navigator',
  SCREEN: 'screen',
  STYLE: 'style',
  STYLES: 'styles',
};

export const NAVIGATOR_TYPE = {
  BOTTOM_TAB: 'bottom-tab',
  STACK: 'stack',
  TOP_TAB: 'top-tab',
};
