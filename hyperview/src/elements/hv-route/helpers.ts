import * as NavigatorService from 'hyperview/src/services/navigator';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { NavigationProps } from 'hyperview/src/types';
import { getFirstChildTag } from 'hyperview/src/services/dom/helpers';

export const getNestedNavigator = (
  id?: string,
  doc?: Document,
): Element | undefined => {
  if (!id || !doc) {
    return undefined;
  }
  const route = NavigatorService.getRouteById(doc, id);
  if (route) {
    return getFirstChildTag(route, LOCAL_NAME.NAVIGATOR) || undefined;
  }
  return undefined;
};

export const getVisibleBackBehaviors = (elements: Element[]): Element[] =>
  elements.filter(element => {
    let node: Node | null = element;
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
  onFocus: () => void,
) => {
  const unsubscribe = navigation.addListener('transitionEnd', event => {
    if (event.data?.closing === true || !navigation.isFocused()) {
      return;
    }
    unsubscribe();
    onFocus();
  });
  return unsubscribe;
};
