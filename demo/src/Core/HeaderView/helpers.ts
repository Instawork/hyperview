import type {
  HeaderIcon,
  HeaderIconMetadataType,
  HeaderItem,
  HeaderMetadata,
  HeaderNavigation,
  NativeHeaderItem,
  SFSymbolIcon,
} from './types';
import { NODE_TYPE, getBehaviorElements } from 'hyperview';

const NAVIGATION_NAMESPACE = 'https://hyperview.org/navigation';

const getAttribute = (element: Element, name: string) =>
  element.getAttributeNS(NAVIGATION_NAMESPACE, name)?.trim() || undefined;

const isElement = (node: Node | null): node is Element =>
  node?.nodeType === NODE_TYPE.ELEMENT_NODE;

const isHidden = (element: Element, root: Element): boolean => {
  for (
    let current: Node | null = element;
    isElement(current);
    current = current.parentNode
  ) {
    if (current.getAttribute('hide') === 'true') {
      return true;
    }
    if (current === root) {
      return false;
    }
  }
  return false;
};

const getVisibleElementsByRole = (element: Element, role: string) =>
  Array.from(element.getElementsByTagName('*')).filter(
    candidate =>
      getAttribute(candidate, 'role') === role && !isHidden(candidate, element),
  );

const hasPressBehavior = (element: Element) =>
  getBehaviorElements(element).some(
    behavior => (behavior.getAttribute('trigger') || 'press') === 'press',
  );

const isIconType = (
  value: string | undefined,
): value is HeaderIconMetadataType =>
  value === 'sfSymbol' || value === 'xcasset';

const parseIcon = (element: Element): HeaderIcon | undefined => {
  const name = getAttribute(element, 'icon');
  const type = getAttribute(element, 'icon-type') || 'sfSymbol';
  if (!name || !isIconType(type)) {
    return undefined;
  }
  if (type === 'xcasset') {
    return { source: { uri: name }, type: 'image' };
  }
  return { name: name as SFSymbolIcon['name'], type };
};

const parseItems = (
  elements: Element[],
  getIcon: (element: Element) => HeaderIcon | undefined,
): HeaderItem[] | undefined => {
  const items = elements.map(element => {
    const disabled = element.getAttribute('disabled') === 'true';
    const icon = getIcon(element);
    const label = getAttribute(element, 'label');
    if ((!icon && !label) || (!disabled && !hasPressBehavior(element))) {
      return undefined;
    }
    return {
      disabled,
      element,
      icon,
      label,
      testID: element.getAttribute('id') || undefined,
    };
  });
  if (items.some(item => item === undefined)) {
    return undefined;
  }
  return items.filter((item): item is HeaderItem => item !== undefined);
};

const parseLeftItems = (
  element: Element,
  role: 'back' | 'close' | undefined,
): HeaderItem[] | undefined => {
  if (!role) {
    return [];
  }
  return parseItems(getVisibleElementsByRole(element, role), () => {
    return {
      name: role === 'close' ? 'xmark' : 'chevron.backward',
      type: 'sfSymbol',
    };
  });
};

const parseRightItems = (element: Element): HeaderItem[] | undefined =>
  parseItems(getVisibleElementsByRole(element, 'right-item'), parseIcon);

export const getHeaderMetadata = (
  element: Element,
  leftRole?: 'back' | 'close',
): HeaderMetadata | undefined => {
  if (!element.hasAttributeNS(NAVIGATION_NAMESPACE, 'title')) {
    return undefined;
  }
  const left = parseLeftItems(element, leftRole);
  if (!left) {
    return undefined;
  }
  const right = parseRightItems(element);
  if (!right) {
    return undefined;
  }
  return {
    left,
    right,
    title: element.getAttributeNS(NAVIGATION_NAMESPACE, 'title')?.trim() || '',
    titleMode:
      getAttribute(element, 'title-mode') === 'large' ? 'large' : 'compact',
  };
};

export const getNativeHeaderItems = (
  items: HeaderItem[] | undefined,
  onPress: (element: Element) => void,
): NativeHeaderItem[] | undefined =>
  items?.map(item => ({
    accessibilityLabel: item.testID ?? item.label,
    disabled: item.disabled,
    ...(item.icon ? { icon: item.icon } : {}),
    identifier: item.testID,
    label: item.label ?? '',
    onPress: () => onPress(item.element),
    sharesBackground: true,
    type: 'button',
    variant: 'plain',
  }));

/**
 * Finds the stack that owns the native header for the current route.
 */
export const getStackHeaderNavigation = (
  navigation: HeaderNavigation,
): HeaderNavigation => {
  let current = navigation;
  while (current.getState().type !== 'stack') {
    const parent = current.getParent<HeaderNavigation>();
    if (!parent) {
      return current;
    }
    current = parent;
  }
  return current;
};
