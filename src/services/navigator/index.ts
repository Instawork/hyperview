import * as Helpers from './helpers';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Imports from './imports';
import * as Types from './types';
import type { NavAction, NavigationRouteParams } from 'hyperview/src/types';
import { NAV_ACTIONS } from 'hyperview/src/types';

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
    action: NavAction,
    routeParams?: NavigationRouteParams,
  ) {
    if (routeParams) {
      const state =
        action === NAV_ACTIONS.BACK
          ? Navigator.getClosestStackState(navigation)
          : Navigator.getClosestModalState(navigation) ||
            Navigator.getClosestStackState(navigation);
      if (state && state.index > 0) {
        const { source, target } = Navigator.getFocused(state);
        navigation.dispatch({
          ...Imports.CommonActions.setParams({
            ...routeParams,
          }),
          source,
          target,
        });
      }
    }
    navigation.goBack();
  }

  static getClosestStackState(
    navigation: Types.NavigationProp,
  ): Types.NavigationState | undefined {
    let state: Types.NavigationState | undefined = navigation.getState();
    while (state?.type !== Types.NAVIGATOR_TYPE.STACK) {
      state = navigation.getParent()?.getState();
    }
    return state;
  }

  static getClosestModalState(
    navigation: Types.NavigationProp,
  ): Types.NavigationState | undefined {
    const state = Navigator.getClosestStackState(navigation);
    if (state && state.routes.some(r => r.name === Types.ID_MODAL)) {
      return state;
    }
    const parent = navigation.getParent();
    if (parent) {
      return Navigator.getClosestModalState(parent);
    }
    return undefined;
  }

  static getFocused(
    state: Types.NavigationState,
  ): { source: string; target: string } {
    let route = state.routes[state.index - 1];
    let targetState = state;
    let sourceRoute = route;
    while (route?.state) {
      targetState = route.state;
      route = targetState.routes[targetState.index];
      sourceRoute = route;
    }
    return {
      source: sourceRoute.key,
      target: targetState.key,
    };
  }

  /**
   * Prepare and send the request
   */
  sendRequest = (action: NavAction, routeParams?: NavigationRouteParams) => {
    const [navAction, navigation, routeId, params] = Helpers.buildRequest(
      this.props.navigation,
      action,
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
      case NAV_ACTIONS.BACK:
      case NAV_ACTIONS.CLOSE:
        Navigator.routeBackRequest(navigation, navAction, routeParams);
        break;
      case NAV_ACTIONS.NAVIGATE:
      case NAV_ACTIONS.NEW:
        if (routeId) {
          navigation.dispatch(Imports.CommonActions.navigate(routeId, params));
        }
        break;
      case NAV_ACTIONS.PUSH:
        if (routeId) {
          navigation.dispatch(Imports.StackActions.push(routeId, params));
        }
        break;
      default:
    }
  };

  back = (params?: NavigationRouteParams | undefined) => {
    this.sendRequest(NAV_ACTIONS.BACK, params);
  };

  closeModal = (params: NavigationRouteParams | undefined) => {
    this.sendRequest(NAV_ACTIONS.CLOSE, params);
  };

  navigate = (params: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.NAVIGATE, params);
  };

  openModal = (params: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.NEW, params);
  };

  push = (params: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.PUSH, params);
  };
}

export type { NavigationProp, Route } from './types';
export {
  CardStyleInterpolators,
  createStackNavigator,
  createBottomTabNavigator,
} from './imports';
export { HvRouteError, HvNavigatorError, HvRenderError } from './errors';
export {
  addStackRoute,
  isDynamicRoute,
  isUrlFragment,
  cleanHrefFragment,
  getChildElements,
  getNavigatorById,
  getRouteById,
  getSelectedNavRouteElement,
  getUrlFromHref,
  mergeDocument,
  removeStackRoute,
  setSelected,
} from './helpers';
export { ID_CARD, ID_MODAL, KEY_MODAL, NAVIGATOR_TYPE } from './types';
