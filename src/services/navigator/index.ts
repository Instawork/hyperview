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
  static routeBackRequest(
    navigation: Types.NavigationProp,
    routeParams?: NavigationRouteParams,
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
        Navigator.routeBackRequest(navigation, routeParams);
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
