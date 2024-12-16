import * as Components from 'hyperview/src/services/components';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as UrlService from 'hyperview/src/services/url';
import type {
  BehaviorOptions,
  NavAction,
  NavigationProps,
  NavigationRouteParams,
} from 'hyperview/src/types';
import { NAV_ACTIONS } from 'hyperview/src/types';

export const ANCHOR_ID_SEPARATOR = '#';
const QUERY_SEPARATOR = '?';

const getHrefKey = (href: string): string => href.split(QUERY_SEPARATOR)[0];

const routeKeys: {
  [key: string]: string;
} = {};
const preloadScreens: {
  [key: number]: Element;
} = {};

export default class Navigation {
  url: string;

  document: Document | null | undefined = null;

  navigation: NavigationProps;

  constructor(url: string, navigation: NavigationProps) {
    this.url = url;
    this.navigation = navigation;
  }

  setUrl = (url: string) => {
    this.url = url;
  };

  setDocument = (document: Document) => {
    this.document = document;
  };

  getPreloadScreen = (id: number): Element | null | undefined =>
    preloadScreens[id];

  setPreloadScreen = (id: number, element: Element): void => {
    preloadScreens[id] = element;
  };

  removePreloadScreen = (id: number): void => {
    delete preloadScreens[id];
  };

  getRouteKey = (href: string): string | null | undefined =>
    routeKeys[getHrefKey(href)];

  setRouteKey = (href: string, key: string): void => {
    routeKeys[getHrefKey(href)] = key;
  };

  removeRouteKey = (href: string): void => {
    delete routeKeys[getHrefKey(href)];
  };

  navigate = (
    href: string,
    action: NavAction,
    element: Element,
    componentRegistry: Components.Registry,
    opts: BehaviorOptions,
    registerPreload?: (id: number, e: Element) => void,
  ): void => {
    const { showIndicatorId, delay, targetId } = opts;
    const formData: FormData | null | undefined = componentRegistry.getFormData(
      element,
    );

    // Only take the first id if there are multiple
    const indicatorId = showIndicatorId?.split(' ')[0] || null;
    let url = href;
    if (!href.startsWith(ANCHOR_ID_SEPARATOR)) {
      // Serialize form data as query params, if present.
      const baseUrl = UrlService.getUrlFromHref(href, this.url);
      url = UrlService.addFormDataToUrl(baseUrl, formData);
    }

    let preloadScreen = null;
    if (indicatorId && this.document) {
      const screens: HTMLCollectionOf<Element> = this.document.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'screen',
      );
      const loadingScreen: Element | null | undefined = Array.from(
        screens,
      ).find(s => s && s.getAttribute('id') === showIndicatorId);
      if (loadingScreen) {
        preloadScreen = Date.now(); // Not truly unique but sufficient for our use-case
        this.setPreloadScreen(preloadScreen, loadingScreen);
        if (registerPreload) {
          registerPreload(preloadScreen, loadingScreen);
        }
      }
    }

    const routeParams = { delay, preloadScreen, targetId, url } as const;
    if (delay) {
      setTimeout(() => {
        this.executeNavigate(action, routeParams, url, href);
      }, delay);
    } else {
      this.executeNavigate(action, routeParams, url, href);
    }
  };

  executeNavigate = (
    action: NavAction,
    routeParams: NavigationRouteParams,
    url: string,
    href: string,
  ) => {
    switch (action) {
      case NAV_ACTIONS.PUSH:
        this.navigation.push(routeParams);
        break;
      case NAV_ACTIONS.NAVIGATE: {
        const key = this.getRouteKey(url);
        if (key) {
          this.navigation.navigate(routeParams, this.getRouteKey(url));
        } else {
          this.navigation.push(routeParams);
        }
        break;
      }
      case NAV_ACTIONS.NEW:
        this.navigation.openModal(routeParams);
        break;
      case NAV_ACTIONS.CLOSE:
        this.navigation.closeModal(
          href === ANCHOR_ID_SEPARATOR ? undefined : routeParams,
        );
        break;
      case NAV_ACTIONS.BACK:
        this.navigation.back(
          href === ANCHOR_ID_SEPARATOR ? undefined : routeParams,
        );
        break;
      default:
    }
  };
}
