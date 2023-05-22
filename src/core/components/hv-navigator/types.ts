/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element } from 'hyperview/src/services/navigator/types';

/**
 * Props used by hv-navigator
 */
export type ContentProps = {
  element: Element;
};

/**
 * Props used for data fetching by hv-route
 */
export type DataProps = {
  url?: string;
};

/**
 * Options used by the navigator screens
 */
export type Options = {
  headerShown?: boolean;
  presentation?: 'modal' | 'card' | 'transparentModal' | undefined;
};

/**
 * All of the props used by hv-navigator
 */
export type Props = ContentProps;
