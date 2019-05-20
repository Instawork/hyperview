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
import { NAV_ACTIONS } from 'hyperview/src/types';

const ANCHOR_ID_SEPARATOR = '#';
const QUERY_SEPARATOR = '?';

const getHrefKey = (href: string): string => href.split(QUERY_SEPARATOR)[0];

export default class Navigation {
  url: string;
  document: Document;
  navigation: NavigationProps;
  preloadScreens: { [number]: Element } = {};
  routeKeys: { [string]: string } = {};

  constructor(url: string, document: Document, navigation: NavigationProps) {
    this.url = url;
    this.document = document;
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

  getRouteKey = (href: string): ?string => this.routeKeys[getHrefKey(href)];

  setRouteKey = (href: string, key: string): void => {
    this.routeKeys[getHrefKey(href)] = key;
  };

  navigate = (
    href: string,
    action: NavAction,
    element: Element,
    opts: BehaviorOptions,
  ): void => {
    const { showIndicatorId, delay } = opts;
    const url = UrlService.getUrlFromHref(href, this.url);

    let preloadScreen = null;
    if (showIndicatorId) {
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

    const routeParams = { url, preloadScreen, delay };

    switch (action) {
      case NAV_ACTIONS.PUSH:
        this.navigation.push(routeParams);
        break;
      case NAV_ACTIONS.REPLACE:
        this.navigation.replace(routeParams);
        break;
      case NAV_ACTIONS.NAVIGATE: {
        this.navigation.navigate(routeParams, this.getRouteKey(url));
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
