// @flow

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as UrlService from 'hyperview/src/services/url';
import type {
  BehaviorOptions,
  Document,
  Element,
  NavAction,
  NavigationProps,
  NodeList,
} from 'hyperview/src/types';
import { NAV_ACTIONS, ComponentRegistry } from 'hyperview/src/types';
import { getFormData } from 'hyperview/src/services';

export const ANCHOR_ID_SEPARATOR = '#';
const QUERY_SEPARATOR = '?';

const getHrefKey = (href: string): string => href.split(QUERY_SEPARATOR)[0];

const routeKeys: { [string]: string } = {};

export default class Navigation {
  url: string;

  document: ?Document = null;

  navigation: NavigationProps;

  preloadScreens: { [number]: Element } = {};

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

  getPreloadScreen = (id: number): ?Element => this.preloadScreens[id];

  setPreloadScreen = (id: number, element: Element): void => {
    this.preloadScreens[id] = element;
  };

  removePreloadScreen = (id: number): void => {
    delete this.preloadScreens[id];
  };

  getRouteKey = (href: string): ?string => routeKeys[getHrefKey(href)];

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
    formComponents: ComponentRegistry,
    opts: BehaviorOptions,
  ): void => {
    const { showIndicatorId, delay } = opts;
    const formData: ?FormData = getFormData(element, formComponents);

    // Serialize form data as query params, if present.
    const baseUrl = UrlService.getUrlFromHref(href, this.url);
    const url = UrlService.addFormDataToUrl(baseUrl, formData);

    let preloadScreen = null;
    if (showIndicatorId && this.document) {
      const screens: NodeList<Element> = this.document.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'screen',
      );
      const loadingScreen: ?Element = Array.from(screens).find(
        s => s && s.getAttribute('id') === showIndicatorId,
      );
      if (loadingScreen) {
        preloadScreen = Date.now(); // Not trully unique but sufficient for our use-case
        this.setPreloadScreen(preloadScreen, loadingScreen);
      }
    }

    const routeParams = { delay, preloadScreen, url };

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
