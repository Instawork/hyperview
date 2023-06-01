/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorContext from 'hyperview/src/contexts/navigator';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as TypesLegacy from 'hyperview/src/types-legacy';

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
export type RNTypedNavigationProps = NavigatorService.NavigationProp<object>;

/**
 * Props used by navigation components
 * Route contains the type of the params object
 */
export type NavigationProps = {
  navigation?: RNTypedNavigationProps;
  route?: NavigatorService.Route<string, DataProps>;
};

/**
 * The props used by inner components of hv-route
 */
export type InnerRouteProps = DataProps &
  NavigationProps &
  NavigationContext.NavigationContextProps &
  NavigatorContext.NavigatorCache & { element?: TypesLegacy.Element };

/**
 * All of the props used by hv-route
 */
export type Props = NavigationProps;
