/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  NavigationProp,
  Route,
} from 'hyperview/src/services/navigator/imports';

/**
 * Props used for data fetching by hv-route
 */
export type DataProps = {
  url?: string;
};

/**
 * Props used by navigation components
 * Route contains the type of the params object
 */
export type NavigationProps = {
  navigation?: NavigationProp<object>; // *** AHG TODO GET RIGHT TYPE
  route?: Route<string, DataProps>;
};

/**
 * All of the props used by hv-route
 */
export type Props = DataProps & NavigationProps;
