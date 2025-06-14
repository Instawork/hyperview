import * as Components from 'hyperview/src/services/components';
import * as Helpers from './helpers';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Types from './types';
import * as UrlService from 'hyperview/src/services/url';
import type {
  BehaviorOptions,
  NavAction,
  NavigationProvider,
  NavigationRouteParams,
} from 'hyperview/src/types';
import { CommonActions, StackActions } from '@react-navigation/native';
import { NAV_ACTIONS } from 'hyperview/src/types';
import { uuidNumber } from 'hyperview/src/core/utils';

/**
 * Provide navigation action implementations
 */
export class Navigator implements NavigationProvider {
  props: Types.Props;

  constructor(props: Types.Props) {
    this.props = props;
  }

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
        ...CommonActions.reset({
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
      const route = this.props.rootNavigation?.getCurrentRoute();
      if (route) {
        navigation.dispatch({
          ...CommonActions.setParams({
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
          navigation.dispatch(CommonActions.navigate(routeId, params));
        }
        break;
      case NAV_ACTIONS.PUSH:
        if (routeId) {
          navigation.dispatch(StackActions.push(routeId, params));
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
          preloadScreen = uuidNumber();
          this.props.setElement?.(preloadScreen, loadingScreen);
        }
      }

      if (!preloadScreen && opts.behaviorElement) {
        // Pass the behavior element to the loading screen
        behaviorElementId = uuidNumber();
        this.props.setElement?.(behaviorElementId, opts.behaviorElement);
      }
    }

    const routeParams =
      (action === NAV_ACTIONS.CLOSE || action === NAV_ACTIONS.BACK) &&
      href === Types.ANCHOR_ID_SEPARATOR
        ? // Route params are not needed for close or back actions with no href
          undefined
        : ({
            behaviorElementId,
            delay,
            preloadScreen,
            targetId,
            url,
          } as const);

    if (delay) {
      setTimeout(() => {
        this.sendRequest(action, routeParams);
      }, delay);
    } else {
      this.sendRequest(action, routeParams);
    }
  };

  backAction = (params?: NavigationRouteParams | undefined) => {
    this.sendRequest(NAV_ACTIONS.BACK, params);
  };

  openModalAction = (params: NavigationRouteParams) => {
    this.sendRequest(NAV_ACTIONS.NEW, params);
  };
}

export type {
  ListenerEvent,
  NavigationComponents,
  NavigationProp,
  NavigatorProps,
} from './types';
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
