import * as Helpers from './helpers';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Imports from './imports';
import * as Types from './types';
import type { NavAction, NavigationRouteParams } from 'hyperview/src/types';
import { NAV_ACTIONS } from 'hyperview/src/types';
import { NavigationContainerRefContext } from '@react-navigation/native';

/**
 * Provide navigation action implementations
 */
export class Navigator {
  props: HvRoute.Props;

  context:
    | React.ContextType<typeof NavigationContainerRefContext>
    | undefined = undefined;

  constructor(props: HvRoute.Props) {
    this.props = props;
  }

  setContext = (
    context: React.ContextType<typeof NavigationContainerRefContext>,
  ) => {
    this.context = context;
  };

  /**
   * Process the request by changing params before going back
   * Only the current navigator is targeted
   * If the navigator is not type stack, the back request is bubbled
   */
  routeBackRequest(
    navigation: Types.NavigationProp,
    sourceKey: string,
    routeParams?: NavigationRouteParams,
  ) {
    // Perform close by state reset
    let state: Types.NavigationState | undefined = navigation.getState();
    let targetNavigation: Types.NavigationProp | undefined = navigation;
    let routes = state?.routes.filter(route => route.key !== sourceKey) || [];
    // Handle empty stacks
    while (
      (targetNavigation?.getParent() && routes.length === 0) ||
      state?.type === Types.NAVIGATOR_TYPE.TAB
    ) {
      targetNavigation = navigation.getParent();
      state = targetNavigation?.getState();
      routes = state?.routes.slice(0, state.index) || [];
    }

    if (state && targetNavigation && routes.length > 0) {
      // Reset the state
      targetNavigation?.dispatch({
        ...Imports.CommonActions.reset({
          ...state,
          index: routes.length - 1,
          routes,
        }),
      });

      // Update the params of the new focused route
      if (routeParams) {
        const route = this.context?.getCurrentRoute();
        if (route) {
          targetNavigation.dispatch({
            ...Imports.CommonActions.setParams({
              ...routeParams,
            }),
            source: route.key,
          });
        }
      }
    }
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
        this.routeBackRequest(
          navigation,
          this.props.route?.key || 'unknown',
          routeParams,
        );
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
