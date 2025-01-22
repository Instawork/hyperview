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

export default class Navigation {
  entrypointUrl: string;

  document: Document | null | undefined = null;

  navigation: NavigationProps;

  constructor(url: string, navigation: NavigationProps) {
    this.entrypointUrl = url;
    this.navigation = navigation;
  }

  setDocument = (document: Document) => {
    this.document = document;
  };

  navigate = (
    href: string,
    action: NavAction,
    element: Element,
    componentRegistry: Components.Registry,
    opts: BehaviorOptions,
    stateUrl?: string | null,
    setElement?: (id: number, e: Element) => void,
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
      const baseUrl = UrlService.getUrlFromHref(
        href,
        stateUrl || this.entrypointUrl,
      );
      url = UrlService.addFormDataToUrl(baseUrl, formData);
    }

    let preloadScreen: number | null = null;
    let behaviorElementId: number | null = null;
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
        if (setElement) {
          setElement(preloadScreen, loadingScreen);
        }
      }
    }

    if (!preloadScreen && opts.behaviorElement) {
      // Pass the behavior element to the loading screen
      behaviorElementId = Date.now();
      if (setElement) {
        setElement(behaviorElementId, opts.behaviorElement);
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
        this.navigation.navigate(routeParams);
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
