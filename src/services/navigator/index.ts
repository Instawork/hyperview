/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Helpers from './helpers';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Imports from './imports';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';

/**
 * Provide navigation action implementations
 */
export class Navigator {
  props: HvRoute.Props;

  constructor(props: HvRoute.Props) {
    this.props = props;
  }

  /**
   * Build the request structure including finding the navigation,
   * building params, and determining screen id
   */
  buildRequest = (
    action: TypesLegacy.NavAction,
    routeParams: TypesLegacy.NavigationRouteParams,
  ): [
    HvRoute.RNTypedNavigationProps | undefined,
    string,
    (
      | Types.NavigationNavigateParams
      | TypesLegacy.NavigationRouteParams
      | undefined
    ),
  ] => {
    // For a back behavior with params, the current navigator is targeted
    if (action === TypesLegacy.NAV_ACTIONS.BACK && routeParams.url) {
      return [this.props.navigation, '', routeParams];
    }

    Helpers.validateUrl(action, routeParams);

    const [navigation, path] = Helpers.getNavigatorAndPath(
      routeParams.targetId,
      this.props.navigation,
    );
    if (!navigation) {
      return [undefined, '', undefined];
    }

    // Static routes are those found in the current state. Tab navigators are always static.
    const isStatic: boolean =
      (path !== undefined && path.length > 0) ||
      navigation.getState().type !== Types.NAVIGATOR_TYPE.STACK;
    let routeId = Helpers.getRouteId(action, routeParams.url, isStatic);

    let params:
      | Types.NavigationNavigateParams
      | TypesLegacy.NavigationRouteParams;
    if (!path || !path.length) {
      params = routeParams;
    } else {
      // The first path id is the screen id, remove from the path to avoid adding it in params
      const lastPathId = path.shift();
      params = Helpers.buildParams(routeId, path, routeParams);
      if (lastPathId) {
        routeId = lastPathId;
      }
    }

    return [navigation, routeId, params];
  };

  /**
   * Process the request by changing params before going back
   * Only the current navigator is targeted
   * If the navigator is not type stack, the back request is bubbled
   */
  static routeBackRequest(
    navigation: HvRoute.RNTypedNavigationProps,
    routeParams?: TypesLegacy.NavigationRouteParams,
  ) {
    const state = navigation.getState();

    if (
      routeParams &&
      state.type === Types.NAVIGATOR_TYPE.STACK &&
      state.index > 0
    ) {
      const prev = state.routes[state.index - 1];

      navigation.dispatch({
        ...Imports.CommonActions.setParams({
          ...routeParams,
        }),
        source: prev.key,
        target: state.key,
      });
    }
    navigation.goBack();
  }

  /**
   * Prepare and send the request
   */
  sendRequest = (
    action: TypesLegacy.NavAction,
    routeParams?: TypesLegacy.NavigationRouteParams,
  ) => {
    let { navigation } = this.props;
    let routeId: string | undefined;
    let params:
      | Types.NavigationNavigateParams
      | TypesLegacy.NavigationRouteParams
      | undefined;
    let navAction: TypesLegacy.NavAction = action;

    if (routeParams) {
      // The push action is used for urls which are not associated with a route
      // See use of `this.getRouteKey(url);` in `hyperview/src/services/navigation`
      if (routeParams.url) {
        if (
          navAction === TypesLegacy.NAV_ACTIONS.PUSH &&
          Helpers.isUrlFragment(routeParams.url)
        ) {
          navAction = TypesLegacy.NAV_ACTIONS.NAVIGATE;
        }
      }

      const [
        requestNavigation,
        requestRouteId,
        requestParams,
      ] = this.buildRequest(navAction, routeParams || {});

      navigation = requestNavigation;
      routeId = requestRouteId;
      params = requestParams;
    }

    if (!navigation) {
      if (routeParams?.targetId) {
        console.warn(
          `No navigation found for target '${routeParams.targetId}'`,
        );
      }
      return;
    }

    switch (navAction) {
      case TypesLegacy.NAV_ACTIONS.BACK:
      case TypesLegacy.NAV_ACTIONS.CLOSE:
        Navigator.routeBackRequest(navigation, routeParams);
        break;
      case TypesLegacy.NAV_ACTIONS.NAVIGATE:
      case TypesLegacy.NAV_ACTIONS.NEW:
        if (routeId) {
          navigation.dispatch(Imports.CommonActions.navigate(routeId, params));
        }
        break;
      case TypesLegacy.NAV_ACTIONS.PUSH:
        if (routeId) {
          navigation.dispatch(Imports.StackActions.push(routeId, params));
        }
        break;
      default:
    }
  };

  back = (params: TypesLegacy.NavigationRouteParams | undefined) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.BACK, params);
  };

  closeModal = (params: TypesLegacy.NavigationRouteParams | undefined) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.CLOSE, params);
  };

  navigate = (params: TypesLegacy.NavigationRouteParams) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.NAVIGATE, params);
  };

  openModal = (params: TypesLegacy.NavigationRouteParams) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.NEW, params);
  };

  push = (params: TypesLegacy.NavigationRouteParams) => {
    this.sendRequest(TypesLegacy.NAV_ACTIONS.PUSH, params);
  };
}

export type { NavigationProp, Route } from './imports';
export {
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from './imports';
export { HvRouteError, HvNavigatorError, HvRenderError } from './errors';
export {
  isUrlFragment,
  cleanHrefFragment,
  getChildElements,
  getInitialNavRouteElement,
  getUrlFromHref,
} from './helpers';
export { ID_DYNAMIC, ID_MODAL, NAVIGATOR_TYPE } from './types';
