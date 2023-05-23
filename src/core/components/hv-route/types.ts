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
import { NavigationContextProps } from 'hyperview/src/contexts/navigation';
import { NavigatorCache } from 'hyperview/src/contexts/navigator';

/**
 * Props used for data fetching by hv-route
 */
export type DataProps = {
  id?: string;
  url?: string;
};

/**
 * Params passed to hv-route
 */
export type RouteParams = DataProps;

/**
 * Props used by navigation components
 * Route contains the type of the params object
 */
export type NavigationProps = {
  navigation?: NavigationProp<object>; // *** AHG TODO GET RIGHT TYPE
  route?: Route<string, DataProps>;
};

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = DataProps &
  NavigationProps &
  NavigationContextProps &
  NavigatorCache;

/**
 * All of the props used by hv-route
 */
export type Props = NavigationProps;
