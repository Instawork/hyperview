import * as NavigatorService from 'hyperview/src/services/navigator';
import type {
  ListenerEvent,
  NavigationProps,
  RouteProps,
} from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { getFirstChildTag } from 'hyperview/src/services/dom/helpers';

export const getNestedNavigator = (
  id?: string,
  doc?: Document,
): Element | undefined => {
  if (!id || !doc) {
    return undefined;
  }

  const route = NavigatorService.getRouteById(doc, id);
  if (!route) {
    return undefined;
  }
  return getFirstChildTag(route, LOCAL_NAME.NAVIGATOR) ?? undefined;
};

export const getVisibleBackBehaviors = (elements: Element[]): Element[] =>
  elements.filter(el => {
    let node: Node | null = el;
    while (node && node.nodeType !== 9) {
      if ((node as Element).getAttribute?.('hide') === 'true') {
        return false;
      }
      node = (node as Element).parentNode;
    }
    return true;
  });

export const registerRouteFocusListener = (
  navigation: NavigationProps,
  route: RouteProps | undefined,
  onRouteFocus: ((focusedRoute: RouteProps) => void) | undefined,
) =>
  navigation.addListener('transitionEnd', (event: ListenerEvent) => {
    if (
      event.data?.closing !== true &&
      navigation.isFocused() &&
      onRouteFocus &&
      route
    ) {
      onRouteFocus(route);
    }
  });
