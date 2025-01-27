import * as Components from 'hyperview/src/services/components';
import * as Helpers from './helpers';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Imports from './imports';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Types from './types';
import * as UrlService from 'hyperview/src/services/url';
import type {
  BehaviorOptions,
  NavAction,
  NavigationRouteParams,
} from 'hyperview/src/types';
import { NAV_ACTIONS } from 'hyperview/src/types';
import { NavigationContainerRefContext } from '@react-navigation/native';

/**
 * Provide navigation action implementations
 */
export class Navigator {
  props: HvRoute.InnerRouteProps;

  context:
    | React.ContextType<typeof NavigationContainerRefContext>
    | undefined = undefined;

  constructor(props: HvRoute.InnerRouteProps) {
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

  navigate = (
    href: string,
    action: NavAction,
    element: Element,
    componentRegistry: Components.Registry,
    opts: BehaviorOptions,
    stateUrl?: string | null,
    doc?: Document | null,
  ): void => {
    const { showIndicatorId, delay, targetId } = opts;
    const formData: FormData | null | undefined = componentRegistry.getFormData(
      element,
    );

    // Only take the first id if there are multiple
    const indicatorId = showIndicatorId?.split(' ')[0] || null;
    let url = href;
    if (!href.startsWith(Types.ANCHOR_ID_SEPARATOR)) {
      // Serialize form data as query params, if present.
      const baseUrl = UrlService.getUrlFromHref(
        href,
        stateUrl || this.props.entrypointUrl,
      );
      url = UrlService.addFormDataToUrl(baseUrl, formData);
    }

    const isBlankUrl = !url || url === Types.ANCHOR_ID_SEPARATOR;
    let preloadScreen: number | null = null;
    let behaviorElementId: number | null = null;
    if (!isBlankUrl) {
      // Only cache elements when a load will occur
      if (indicatorId && doc) {
        const screens: HTMLCollectionOf<Element> = doc.getElementsByTagNameNS(
          Namespaces.HYPERVIEW,
          'screen',
        );
        const loadingScreen: Element | null | undefined = Array.from(
          screens,
        ).find(s => s && s.getAttribute('id') === showIndicatorId);
        if (loadingScreen) {
          preloadScreen = Date.now(); // Not truly unique but sufficient for our use-case
          this.props.setElement?.(preloadScreen, loadingScreen);
        }
      }

      if (!preloadScreen && opts.behaviorElement) {
        // Pass the behavior element to the loading screen
        behaviorElementId = Date.now();
        this.props.setElement?.(behaviorElementId, opts.behaviorElement);
      }
    }

    const routeParams = {
      behaviorElementId,
      delay,
      preloadScreen,
      targetId,
      url,
    } as const;

    if (delay) {
      setTimeout(() => {
        this.executeNavigate(action, routeParams, href);
      }, delay);
    } else {
      this.executeNavigate(action, routeParams, href);
    }
  };

  executeNavigate = (
    action: NavAction,
    routeParams: NavigationRouteParams,
    href: string,
  ) => {
    switch (action) {
      case NAV_ACTIONS.PUSH:
        this.pushAction(routeParams);
        break;
      case NAV_ACTIONS.NAVIGATE: {
        this.navigateAction(routeParams);
        break;
      }
      case NAV_ACTIONS.NEW:
        this.openModalAction(routeParams);
        break;
      case NAV_ACTIONS.CLOSE:
        this.closeModalAction(
          href === Types.ANCHOR_ID_SEPARATOR ? undefined : routeParams,
        );
        break;
      case NAV_ACTIONS.BACK:
        this.backAction(
          href === Types.ANCHOR_ID_SEPARATOR ? undefined : routeParams,
        );
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
export {
  ANCHOR_ID_SEPARATOR,
  ID_CARD,
  ID_MODAL,
  KEY_MODAL,
  NAVIGATOR_TYPE,
} from './types';
