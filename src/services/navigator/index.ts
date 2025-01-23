import * as Helpers from './helpers';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Imports from './imports';
import * as Logging from 'hyperview/src/services/logging';
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
    action: NavAction,
    sourceKey: string,
    routeParams?: NavigationRouteParams,
  ) {
    const state = navigation.getState();
    const sourceIndex = state?.routes.findIndex(
      route => route.key === sourceKey,
    );

    if (
      action === NAV_ACTIONS.BACK &&
      sourceIndex &&
      sourceIndex < state.index
    ) {
      // Back request from a non-focused route
      // Remove the target route and reset the state
      const routes =
        state?.routes.filter(route => route.key !== sourceKey) || [];
      navigation?.dispatch({
        ...Imports.CommonActions.reset({
          ...state,
          index: routes.length - 1,
          routes,
        }),
      });
    } else {
      // Close request or back request from the focused route
      navigation.goBack();
    }

    // Update the params of the new focused route
    if (routeParams) {
      const route = this.context?.getCurrentRoute();
      if (route) {
        navigation.dispatch({
          ...Imports.CommonActions.setParams({
            ...routeParams,
          }),
          source: route.key,
        });
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
        Logging.info(`sendRequest action ${action} routeParams ${routeParams}`);
        Logging.warn('No navigation found for provided target');
      }
      return;
    }

    switch (navAction) {
      case NAV_ACTIONS.BACK:
      case NAV_ACTIONS.CLOSE:
        this.routeBackRequest(
          navigation,
          navAction,
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

  backAction = (params?: NavigationRouteParams | undefined) => {
    this.sendRequest(NAV_ACTIONS.BACK, params);
  };

  closeModalAction = (params: NavigationRouteParams | undefined) => {
    this.sendRequest(NAV_ACTIONS.CLOSE, params);
  };

  navigateAction = (params: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.NAVIGATE, params);
  };

  openModalAction = (params: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.NEW, params);
  };

  pushAction = (params: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.PUSH, params);
  };
}

export type {
  NavigationComponents,
  NavigationProp,
  NavigatorProps,
  Route,
} from './types';
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
  updateRouteUrlFromState,
} from './helpers';
export { ID_CARD, ID_MODAL, KEY_MODAL, NAVIGATOR_TYPE } from './types';
