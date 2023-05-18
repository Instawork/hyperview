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
 * Options used by the navigator
 */
export type Options = {
  headerShown?: boolean;
  presentation?: 'modal' | 'card' | 'transparentModal' | undefined;
};

/**
 * All of the props used by hv-route
 */
export type Props = ContentProps;
