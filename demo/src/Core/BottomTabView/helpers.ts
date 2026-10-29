import type { HvComponentProps } from 'hyperview';
import type { NativeTabBarItems } from './types';
import { Platform } from 'react-native';
import { getUrlFromHref } from 'hyperview';

const getAttribute = (element: Element, name: string) => {
  return element.getAttributeNS(element.namespaceURI, name)?.trim();
};

const isImagePath = (value: string) => {
  return (
    value.includes('/') || /\.(gif|jpe?g|png|webp)(?:[?#].*)?$/i.test(value)
  );
};

const getIcon = (element: Element, documentUrl: string) => {
  const value = getAttribute(element, 'icon');
  if (!value) {
    return undefined;
  }
  if (isImagePath(value)) {
    return {
      templateSource: { uri: getUrlFromHref(value, documentUrl) },
      type: 'templateSource' as const,
    };
  }
  return { name: value, type: 'sfSymbol' as const };
};

export const getNativeTabItems = (props: HvComponentProps | undefined) => {
  if (!props) {
    return undefined;
  }

  const items: NativeTabBarItems = [];
  const { element } = props;
  const { screenUrl } = props.options;
  const documentUrl = typeof screenUrl === 'string' ? screenUrl : '';

  Array.from(
    element.getElementsByTagNameNS(element.namespaceURI, 'bottom-tab-bar-item'),
  ).forEach(item => {
    const route = getAttribute(item, 'route');
    if (route) {
      items.push({
        badgeValue: getAttribute(item, 'badge'),
        icon: getIcon(item, documentUrl),
        label: getAttribute(item, 'label'),
        route,
      });
    }
  });
  return items;
};

export const isLiquidGlassSupported = (
  platformOS = Platform.OS,
  platformVersion = Platform.Version,
) => platformOS === 'ios' && Number(platformVersion) >= 26;
