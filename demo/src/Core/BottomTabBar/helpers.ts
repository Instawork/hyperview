import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import type {
  NavigationWithOptions,
  Props,
  TabBarItemPresentation,
  TabBarRouteItem,
} from './types';
import { Platform } from 'react-native';
import { getUrlFromHref } from 'hyperview';

const namespaceURI = 'https://hyperview.org/navigation';

function getTabBarItemRoute(element: Element): string | null {
  return element.getAttributeNS(namespaceURI, 'route');
}

function getTabBarItemLabel(element: Element): string {
  return (element.getAttributeNS(namespaceURI, 'label') || '').trim();
}

function getTabBarItemBadge(element: Element): string | undefined {
  const badge = (element.getAttributeNS(namespaceURI, 'badge') || '').trim();
  if (!badge || badge === 'false') {
    return undefined;
  }
  if (badge === 'true') {
    return '1';
  }
  return badge;
}

function isImageIconHref(value: string): boolean {
  return (
    value.startsWith('/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    /\.(png|jpe?g|gif|webp)$/i.test(value)
  );
}

function getTabBarItemIconHref(element: Element): string | undefined {
  const icon = (element.getAttributeNS(namespaceURI, 'icon') || '').trim();
  if (icon && isImageIconHref(icon)) {
    return icon;
  }
  return undefined;
}

function collectBottomTabBarItems(root: Element): Element[] {
  return Array.from(
    root.getElementsByTagNameNS(namespaceURI, 'bottom-tab-bar-item'),
  );
}

function getTabBarItemPresentation(element: Element): TabBarItemPresentation {
  return {
    badgeValue: getTabBarItemBadge(element),
    iconHref: getTabBarItemIconHref(element),
    label: getTabBarItemLabel(element),
    route: getTabBarItemRoute(element),
  };
}

function tabIconSource(href: string, documentUrl: string): ImageSourcePropType {
  return {
    uri: getUrlFromHref(href, documentUrl),
  };
}

function nativeIcon(source: ImageSourcePropType) {
  if (Platform.OS === 'ios') {
    return { templateSource: source, type: 'templateSource' as const };
  }
  return { imageSource: source, type: 'imageSource' as const };
}

export function nativeTabIcon(item: TabBarRouteItem) {
  if (item.iconSource) {
    return nativeIcon(item.iconSource);
  }
  return undefined;
}

export function nativeTabBarItemsByRoute(
  hvElement: Element | undefined,
  documentUrl: string,
): Record<string, TabBarRouteItem> {
  const items: Record<string, TabBarRouteItem> = {};
  if (!hvElement) {
    return items;
  }
  collectBottomTabBarItems(hvElement).forEach(item => {
    const presentation = getTabBarItemPresentation(item);
    const { route } = presentation;
    if (!route) {
      return;
    }
    items[route] = {
      badgeValue: presentation.badgeValue,
      iconSource:
        presentation.iconHref && documentUrl
          ? tabIconSource(presentation.iconHref, documentUrl)
          : null,
      label: presentation.label,
    };
  });
  return items;
}

export function setTabBarStyle(
  navigation: Props['navigation'],
  tabBarStyle: StyleProp<ViewStyle>,
) {
  (navigation as NavigationWithOptions).setOptions?.({ tabBarStyle });
}
