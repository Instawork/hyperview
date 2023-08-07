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
import * as TypesLegacy from 'hyperview/src/types';

/**
 * Provide navigation action implementations
 */
export class Navigator {
  props: HvRoute.Props;

  constructor(props: HvRoute.Props) {
    this.props = props;
  }

  /**
   * Process the request by changing params before going back
   * Only the current navigator is targeted
   * If the navigator is not type stack, the back request is bubbled
   */
  static routeBackRequest(
    navigation: Types.NavigationProp,
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
    const navAction: TypesLegacy.NavAction = Helpers.getNavAction(
      action,
      routeParams,
    );

    const [navigation, routeId, params] = Helpers.buildRequest(
      this.props.navigation,
      navAction,
      routeParams,
    );

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

export type { NavigationProp, Route } from './types';
export { createStackNavigator, createBottomTabNavigator } from './imports';
export { HvRouteError, HvNavigatorError, HvRenderError } from './errors';
export {
  isUrlFragment,
  cleanHrefFragment,
  getChildElements,
  getSelectedNavRouteElement,
  getUrlFromHref,
} from './helpers';
export { ID_DYNAMIC, ID_MODAL, NAVIGATOR_TYPE } from './types';
