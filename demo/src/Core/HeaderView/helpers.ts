import type {
  HeaderButtonItem,
  HeaderItem,
  HeaderMenuAction,
  HeaderMetadata,
  HeaderNavigation,
  ItemBackground,
  SFSymbolIcon,
} from './types';
import { NODE_TYPE, getBehaviorElements } from 'hyperview';
import type {
  NativeStackHeaderItem,
  NativeStackHeaderItemMenuAction,
} from '@react-navigation/native-stack';
import type { HeaderCallbacks } from 'hyperview';
import { NAVIGATION_NAMESPACE } from '../../Helpers';
import type { SearchBarPlacement } from 'react-native-screens';
import { isValidElement } from 'react';

const getAttribute = (element: Element, name: string) =>
  element.getAttributeNS(NAVIGATION_NAMESPACE, name)?.trim() || undefined;

const getBadge = (element: Element) => {
  if (!element.hasAttributeNS(NAVIGATION_NAMESPACE, 'badge')) {
    return undefined;
  }
  return (element.getAttributeNS(NAVIGATION_NAMESPACE, 'badge') ?? '').trim();
};

const isElement = (node: Node | null): node is Element =>
  node?.nodeType === NODE_TYPE.ELEMENT_NODE;

const BOOLEAN_VALUES = ['false', 'true'] as const;
const ITEM_BACKGROUNDS = ['none', 'separate', 'shared'] as const;
const ROLES = ['back', 'close', 'left-item', 'right-item', 'title'] as const;
const SEARCH_PLACEMENTS = [
  'automatic',
  'integrated',
  'integratedButton',
  'integratedCentered',
  'stacked',
] as const;
const TITLE_MODES = ['compact', 'large'] as const;
const VARIANTS = ['done', 'plain', 'prominent'] as const;

const VALID_ATTRIBUTE_VALUES: Record<string, readonly string[]> = {
  'header-item-variant': VARIANTS,
  'item-background': ITEM_BACKGROUNDS,
  role: ROLES,
  'search-placement': SEARCH_PLACEMENTS,
  'title-mode': TITLE_MODES,
};

const hasValidNamespacedMetadata = (element: Element) =>
  Object.entries(VALID_ATTRIBUTE_VALUES).every(
    ([name, values]) =>
      !element.hasAttributeNS(NAVIGATION_NAMESPACE, name) ||
      values.includes(
        (element.getAttributeNS(NAVIGATION_NAMESPACE, name) ?? '').trim(),
      ),
  );

const hasValidHeaderMetadata = (element: Element) =>
  [element, ...Array.from(element.getElementsByTagName('*'))].every(
    candidate =>
      hasValidNamespacedMetadata(candidate) &&
      (!candidate.hasAttribute('disabled') ||
        BOOLEAN_VALUES.some(
          value => value === (candidate.getAttribute('disabled') ?? '').trim(),
        )),
  );

const isHidden = (element: Element, root: Element): boolean => {
  if (element.getAttribute('hide') === 'true') {
    return true;
  }
  const parent = element.parentNode;
  return element !== root && isElement(parent) && isHidden(parent, root);
};

const hasRoleAncestor = (element: Element, root: Element): boolean => {
  const parent = element.parentNode;
  return (
    isElement(parent) &&
    parent !== root &&
    (getAttribute(parent, 'role') !== undefined ||
      hasRoleAncestor(parent, root))
  );
};

const getVisibleElementsByRoles = (element: Element, roles: string[]) =>
  Array.from(element.getElementsByTagName('*')).filter(
    candidate =>
      roles.includes(getAttribute(candidate, 'role') || '') &&
      !hasRoleAncestor(candidate, element) &&
      !isHidden(candidate, element),
  );

const hasPressBehavior = (element: Element) =>
  getBehaviorElements(element).some(
    behavior => (behavior.getAttribute('trigger') || 'press') === 'press',
  );

const hasRenderableContent = (element: Element) =>
  Array.from(element.childNodes || []).some(
    child => isElement(child) && child.localName !== 'behavior',
  );

const getEnumAttribute = <T extends string>(
  element: Element,
  name: string,
  values: readonly T[],
) => {
  const value = getAttribute(element, name);
  return values.find(candidate => candidate === value);
};

const parseVariant = (element: Element): HeaderButtonItem['variant'] =>
  getEnumAttribute(element, 'header-item-variant', VARIANTS) ?? 'plain';

const parseItemBackground = (element: Element): ItemBackground =>
  getEnumAttribute(element, 'item-background', ITEM_BACKGROUNDS) ?? 'shared';

const parseIcon = (element: Element): SFSymbolIcon | undefined => {
  const name = getAttribute(element, 'icon');
  if (!name) {
    return undefined;
  }
  return { name: name as SFSymbolIcon['name'], type: 'sfSymbol' };
};

const parseSearchPlacement = (
  element: Element,
): SearchBarPlacement | undefined =>
  getEnumAttribute(element, 'search-placement', SEARCH_PLACEMENTS);

const parseMenuElements = (
  element: Element,
): HeaderMenuAction[] | undefined => {
  const menuElements = Array.from(element.childNodes || [])
    .filter(isElement)
    .filter(candidate => getAttribute(candidate, 'label') !== undefined);
  if (!menuElements.length) {
    return [];
  }
  const items = menuElements
    .filter(item => !isHidden(item, element))
    .map(item => {
      const label = getAttribute(item, 'label');
      if (!label) {
        return undefined;
      }
      const hasMenuChildren = Array.from(item.childNodes || [])
        .filter(isElement)
        .some(child => getAttribute(child, 'label') !== undefined);
      if (hasMenuChildren) {
        return undefined;
      }
      const disabled = item.getAttribute('disabled') === 'true';
      const id = item.getAttribute('id');
      if (!id || (!disabled && !hasPressBehavior(item))) {
        return undefined;
      }
      const icon = parseIcon(item);
      return {
        disabled,
        id,
        ...(icon ? { icon } : {}),
        label,
        type: 'action' as const,
      };
    });
  return items.length > 0 && items.every(item => item !== undefined)
    ? items
    : undefined;
};

const parseItems = (
  elements: Element[],
  getIcon: (element: Element) => SFSymbolIcon | undefined,
): HeaderItem[] | undefined => {
  const items = elements.map(element => {
    const disabled = element.getAttribute('disabled') === 'true';
    const itemBackground = parseItemBackground(element);
    const id = element.getAttribute('id');
    const icon = getIcon(element);
    const label = getAttribute(element, 'label');
    const badge = getBadge(element);
    const menuItems = parseMenuElements(element);
    if (!menuItems || (menuItems.length > 0 && !icon && !label)) {
      return undefined;
    }
    if (!icon && !label) {
      if (
        badge !== undefined ||
        !hasRenderableContent(element) ||
        itemBackground === 'separate'
      ) {
        return undefined;
      }
      return {
        element,
        itemBackground,
        type: 'custom' as const,
      };
    }
    if (!id) {
      return undefined;
    }
    const shared = {
      accessibilityLabel: getAttribute(element, 'accessibility-label') ?? label,
      badge,
      disabled,
      icon,
      id,
      itemBackground,
      label,
      variant: parseVariant(element),
    };
    if (menuItems.length > 0) {
      return {
        ...shared,
        items: menuItems,
        type: 'menu' as const,
      };
    }
    if (!disabled && !hasPressBehavior(element)) {
      return undefined;
    }
    return {
      ...shared,
      type: 'button' as const,
    };
  });
  if (items.some(item => item === undefined)) {
    return undefined;
  }
  return items.filter((item): item is HeaderItem => item !== undefined);
};

const parseLeftItems = (element: Element): HeaderItem[] | undefined => {
  const elements = getVisibleElementsByRoles(element, [
    'back',
    'close',
    'left-item',
  ]);
  if (
    elements.some(candidate => {
      const role = getAttribute(candidate, 'role');
      return (
        (role === 'back' || role === 'close') &&
        getBadge(candidate) !== undefined
      );
    })
  ) {
    return undefined;
  }
  return parseItems(elements, candidate => {
    const candidateRole = getAttribute(candidate, 'role');
    if (candidateRole === 'back' || candidateRole === 'close') {
      return {
        name: candidateRole === 'close' ? 'xmark' : 'chevron.backward',
        type: 'sfSymbol',
      };
    }
    return parseIcon(candidate);
  });
};

const parseRightItems = (element: Element): HeaderItem[] | undefined =>
  parseItems(getVisibleElementsByRoles(element, ['right-item']), parseIcon);

export const getHeaderMetadata = (
  element: Element,
): HeaderMetadata | undefined => {
  if (
    !hasValidHeaderMetadata(element) ||
    !element.hasAttributeNS(NAVIGATION_NAMESPACE, 'title')
  ) {
    return undefined;
  }
  const titleElements = getVisibleElementsByRoles(element, ['title']);
  if (titleElements.length > 1) {
    return undefined;
  }
  const left = parseLeftItems(element);
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
    searchPlaceholder: getAttribute(element, 'search-placeholder'),
    searchPlacement: parseSearchPlacement(element),
    searchTarget: getAttribute(element, 'search-target'),
    title: element.getAttributeNS(NAVIGATION_NAMESPACE, 'title')?.trim() || '',
    titleElement: titleElements[0],
    titleMode:
      getAttribute(element, 'title-mode') === 'large' ? 'large' : 'compact',
  };
};

export const getNativeHeaderItems = (
  items: HeaderItem[],
  callbacks: HeaderCallbacks,
): NativeStackHeaderItem[] | undefined => {
  const getNativeMenuElement = (
    item: HeaderMenuAction,
  ): NativeStackHeaderItemMenuAction => {
    return {
      disabled: item.disabled,
      ...(item.icon ? { icon: item.icon } : {}),
      label: item.label,
      onPress: () => callbacks.onPress(item.id),
      type: 'action',
    };
  };
  const nativeItems = items.map<NativeStackHeaderItem | undefined>(item => {
    if (item.type === 'custom') {
      const element = callbacks.renderItem(item.element);
      return isValidElement(element)
        ? {
            element,
            hidesSharedBackground: item.itemBackground === 'none',
            type: 'custom' as const,
          }
        : undefined;
    }
    const shared = {
      accessibilityLabel: item.accessibilityLabel,
      ...(item.badge !== undefined
        ? { badge: { value: item.badge || ' ' } }
        : {}),
      disabled: item.disabled,
      hidesSharedBackground: item.itemBackground === 'none',
      ...(item.icon ? { icon: item.icon } : {}),
      identifier: item.id,
      label: item.label ?? '',
      sharesBackground: item.itemBackground !== 'separate',
      variant: item.variant,
    };
    if (item.type === 'menu') {
      return {
        ...shared,
        menu: {
          items: item.items.map(getNativeMenuElement),
        },
        type: 'menu' as const,
      };
    }
    return {
      ...shared,
      onPress: () => callbacks.onPress(item.id),
      type: 'button' as const,
    };
  });
  if (nativeItems.some(item => item === undefined)) {
    return undefined;
  }
  return nativeItems.filter(
    (item): item is NativeStackHeaderItem => item !== undefined,
  );
};

/**
 * Finds the stack that owns the native header for the current route.
 */
export const getStackHeaderNavigation = (
  navigation: HeaderNavigation,
): HeaderNavigation => {
  if (navigation.getState().type === 'stack') {
    return navigation;
  }
  const parent = navigation.getParent<HeaderNavigation>();
  return parent ? getStackHeaderNavigation(parent) : navigation;
};
