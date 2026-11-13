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
import {
  CommonActions,
  StackActions,
  TabActions,
} from '@react-navigation/native';
import { NAVIGATOR_TYPE, NAV_ACTIONS } from 'hyperview/src/types';
import { uuidNumber } from 'hyperview/src/services';

/**
 * Provide navigation action implementations
 */
export class Navigator implements NavigationProvider {
  props: Types.Props;

  constructor(props: Types.Props) {
    this.props = props;
  }

  updateFocusedRouteParams(
    navigation: NavigationProps,
    routeParams?: RouteParams,
  ) {
    if (!routeParams) {
      return;
    }

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
    const sourceIndex = state.routes.findIndex(
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
    } else if (
      action === NAV_ACTIONS.CLOSE &&
      sourceIndex > 0 &&
      sourceIndex < state.index &&
      (state.routes[sourceIndex].params as RouteParams | undefined)?.isModal ===
        true
    ) {
      navigation.dispatch(StackActions.pop(state.index - sourceIndex + 1));
    } else if (
      action === NAV_ACTIONS.BACK &&
      state.type === NAVIGATOR_TYPE.STACK &&
      (sourceIndex > 0 || (sourceIndex < 0 && this.props.route !== undefined))
    ) {
      navigation.dispatch({
        ...CommonActions.goBack(),
        source: sourceKey,
        target: state.key,
      });
    } else {
      // Close request or back request from the focused route
      navigation.goBack();
    }

    this.updateFocusedRouteParams(navigation, routeParams);
  }

  /**
   * Resolve the navigator which owns the route.
   */
  getActiveNavigation = (): NavigationProps | undefined => {
    const { navigation, rootNavigation, route } = this.props;
    const rootState = rootNavigation?.getRootState();

    if (
      !navigation ||
      !route?.key ||
      !rootState ||
      Helpers.findNavigatorKeyForRoute(rootState, route.key)
    ) {
      return navigation;
    }

    return navigation.getParent() || navigation;
  };

  getModalHostTarget(
    navigation: NavigationProps | undefined,
    targetId?: string,
  ): Types.ModalHostTarget | undefined {
    let targetNavigation = navigation;
    while (targetNavigation) {
      const state = targetNavigation.getState();
      const routeName = targetId
        ? Helpers.findModalHostRouteName(state, targetId)
        : this.props.route?.params?.modalHostRouteName;
      if (routeName && targetId) {
        let ownerNavigation: NavigationProps | undefined = targetNavigation;
        while (
          ownerNavigation &&
          !ownerNavigation.getState().routeNames.includes(routeName)
        ) {
          ownerNavigation = ownerNavigation.getParent();
        }
        if (ownerNavigation) {
          return {
            navigation: ownerNavigation,
            routeName,
          };
        }
      } else if (routeName && state.routeNames.includes(routeName)) {
        return {
          navigation: targetNavigation,
          routeName,
        };
      }
      targetNavigation = targetNavigation.getParent();
    }
    return undefined;
  }

  /**
   * Prepare and send the request
   */
  sendRequest = (action: NavAction, routeParams?: RouteParams) => {
    const activeNavigation = this.getActiveNavigation();
    const modalHostTarget =
      action === NAV_ACTIONS.NEW
        ? this.getModalHostTarget(activeNavigation, routeParams?.targetId)
        : undefined;
    const modalHostPath = this.props.route?.params?.modalHostPath;
    const modalHostRouteName = this.props.route?.params?.modalHostRouteName;
    const shouldPropagateModalHost =
      action === NAV_ACTIONS.NEW || action === NAV_ACTIONS.PUSH;
    const requestParams = shouldPropagateModalHost
      ? {
          ...routeParams,
          ...(modalHostPath && { modalHostPath }),
          ...(action === NAV_ACTIONS.PUSH &&
            modalHostRouteName && { modalHostRouteName }),
          ...(modalHostTarget && {
            isModalHost: true,
            needsSubStack: true,
          }),
        }
      : routeParams;
    const [navAction, navigation, routeId, params] = Helpers.buildRequest(
      modalHostTarget?.navigation || activeNavigation,
      action,
      requestParams,
      modalHostTarget?.routeName,
    );

    if (!navigation) {
      if (requestParams?.targetId) {
        Logging.info(
          `sendRequest action ${action} routeParams ${requestParams}`,
        );
        Logging.warn('No navigation found for provided target');
      }
      return;
    }

    const rootState = this.props.rootNavigation?.getRootState();
    const sourceKey = this.props.route?.key;
    const modalHostPopTarget =
      navAction === NAV_ACTIONS.CLOSE && sourceKey
        ? Helpers.getModalHostPopTarget(rootState, sourceKey, modalHostPath)
        : undefined;
    const sourceIsBackground =
      navAction === NAV_ACTIONS.NAVIGATE &&
      !!sourceKey &&
      !!Helpers.findNavigatorKeyForRoute(rootState, sourceKey) &&
      this.props.navigation?.isFocused() === false;

    switch (navAction) {
      case NAV_ACTIONS.BACK:
      case NAV_ACTIONS.CLOSE:
        if (modalHostPopTarget && this.props.rootNavigation) {
          this.props.rootNavigation.dispatch({
            ...StackActions.pop(modalHostPopTarget.count),
            target: modalHostPopTarget.target,
          });
          this.updateFocusedRouteParams(navigation, routeParams);
          break;
        }
        if (
          navAction === NAV_ACTIONS.CLOSE &&
          modalHostPath &&
          modalHostPath.length > 0
        ) {
          break;
        }
        this.routeBackRequest(
          navigation,
          navAction,
          this.props.route?.key || 'unknown',
          routeParams,
        );
        break;
      case NAV_ACTIONS.NAVIGATE: {
        const targetNavigator =
          sourceIsBackground && routeId
            ? Helpers.findNavigatorForRouteName(navigation.getState(), routeId)
            : undefined;
        if (targetNavigator?.type === NAVIGATOR_TYPE.TAB) {
          navigation.dispatch({
            ...TabActions.jumpTo(routeId, params),
            target: targetNavigator.key,
          });
          break;
        }
        if (routeId) {
          navigation.dispatch(
            CommonActions.navigate(routeId, params, { pop: true }),
          );
        }
        break;
      }
      case NAV_ACTIONS.NEW:
        if (routeId) {
          navigation.dispatch(
            CommonActions.navigate(routeId, params, { pop: true }),
          );
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
