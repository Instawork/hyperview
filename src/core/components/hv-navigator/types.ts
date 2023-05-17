/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

/**
 * Props used by hv-navigator
 */
export type ComponentProps = {
  handleBack?: React.ComponentType<{ children: React.ReactNode }>;
};

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

/**
 * Minimal document type copy from 'hyperview/src/types.js'
 */
export type Document = new () => Document;
