import * as Components from 'hyperview/src/services/components';
import * as Helpers from './helpers';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Types from './types';
import * as UrlService from 'hyperview/src/services/url';
import type {
  BehaviorOptions,
  NavAction,
  NavigationProps,
  NavigationProvider,
  RouteParams,
} from 'hyperview/src/types';
import { CommonActions, StackActions } from '@react-navigation/native';
import { NAV_ACTIONS } from 'hyperview/src/types';
import { uuidNumber } from 'hyperview/src/services';

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
    navigation: NavigationProps,
    action: NavAction,
    sourceKey: string,
    routeParams?: RouteParams,
  ) {
    const state = navigation.getState();
    const sourceIndex = state?.routes.findIndex(
      route => route.key === sourceKey,
    );

    if (
      action === NAV_ACTIONS.BACK &&
      sourceIndex >= 0 &&
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
        const target = Helpers.findNavigatorKeyForRoute(
          this.props.rootNavigation?.getRootState(),
          route.key,
        );
        navigation.dispatch({
          ...CommonActions.setParams({
            ...routeParams,
          }),
          source: route.key,
          ...(target && { target }),
        });
      }
    }
  }

  /**
   * Determine if the route is absent from the navigation state
   */
  isRouteUnowned = (): boolean => {
    const { navigation, rootNavigation, route } = this.props;
    if (navigation?.isFocused()) {
      return false;
    }
    const rootState = rootNavigation?.getRootState();
    if (!route?.key || !rootState) {
      return false;
    }
    const ownerKey = Helpers.findNavigatorKeyForRoute(rootState, route.key);
    return typeof ownerKey !== 'string';
  };

  /**
   * Resolve the navigator which owns the route.
   */
  getActiveNavigation = (action: NavAction): NavigationProps | undefined => {
    const { navigation, rootNavigation } = this.props;
    if (!this.isRouteUnowned()) {
      return navigation;
    }
    if (action === NAV_ACTIONS.BACK) {
      return undefined;
    }
    // A detached route can have a detached parent, and dispatching there goes
    // nowhere, so only continue from the parent while it is still mounted.
    const parent = navigation?.getParent();
    if (
      Helpers.isNavigatorMounted(
        rootNavigation?.getRootState(),
        parent?.getState().key,
      )
    ) {
      return parent;
    }
    return rootNavigation as NavigationProps;
  };

  /**
   * Prepare and send the request
   */
  sendRequest = (action: NavAction, routeParams?: RouteParams) => {
    const routeIsUnowned = this.isRouteUnowned();
    const routeKey = this.props.route?.key;
    const routeWasRemoved =
      routeKey &&
      this.props.navigation &&
      typeof Helpers.findNavigatorKeyForRoute(
        this.props.navigation.getState(),
        routeKey,
      ) !== 'string';
    const activeNavigation = this.getActiveNavigation(action);
    const [navAction, navigation, routeId, params] = Helpers.buildRequest(
      activeNavigation,
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
          const navigationState = navigation.getState();
          const currentRoute = navigationState.routes[navigationState.index];
          if (
            navAction === NAV_ACTIONS.NEW &&
            routeIsUnowned &&
            routeWasRemoved &&
            Helpers.isModalRouteName(currentRoute?.name)
          ) {
            navigation.dispatch({
              ...StackActions.replace(routeId, params),
              target: navigationState.key,
            });
            break;
          }
          // Unwind only when the route belongs to the target navigator
          const pop = !routeIsUnowned;
          navigation.dispatch({
            ...CommonActions.navigate(routeId, params),
            payload: {
              name: routeId,
              params,
              pop,
            },
          });
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
    doc?: Document,
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

  backAction = (params?: RouteParams | undefined) => {
    this.sendRequest(NAV_ACTIONS.BACK, params);
  };

  openModalAction = (params: RouteParams) => {
    this.sendRequest(NAV_ACTIONS.NEW, params);
  };

  updateRouteUrl = (url: string) => {
    const routeKey = this.props.route?.key;
    if (!this.props.navigation || !routeKey) {
      return;
    }
    this.props.navigation.dispatch({
      ...CommonActions.setParams({
        url,
      }),
      source: routeKey,
    });
  };
}
