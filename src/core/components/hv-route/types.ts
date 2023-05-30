/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NavigationProp, Route } from '../../../services/navigator/imports';
import { Element } from '../../../types-legacy';
import { NavigationContextProps } from '../../../contexts/navigation';
import { NavigatorCache } from '../../../contexts/navigator';

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
 * The navigation prop used by react-navigation
 */
// TODO AHG TODO GET RIGHT TYPE
export type RNTypedNavigationProps = NavigationProp<object>;

/**
 * Props used by navigation components
 * Route contains the type of the params object
 */
export type NavigationProps = {
  navigation?: RNTypedNavigationProps;
  route?: Route<string, DataProps>;
};

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = DataProps &
  NavigationProps &
  NavigationContextProps &
  NavigatorCache & { element?: Element };

/**
 * All of the props used by hv-route
 */
export type Props = NavigationProps;
