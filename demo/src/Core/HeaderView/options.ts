import type { HeaderItem, NativeSearchBinding } from './types';
import { getHeaderMetadata, getNativeHeaderItems } from './helpers';
import type { HeaderCallbacks } from 'hyperview';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { isLiquidGlassSupported } from '../../Helpers';

const titleStyle = {
  fontSize: 24,
  fontWeight: '600' as const,
};

export const resetHeaderOptions: NativeStackNavigationOptions = {
  headerBackVisible: undefined,
  headerBlurEffect: undefined,
  headerLargeTitleEnabled: undefined,
  headerLargeTitleStyle: undefined,
  headerSearchBarOptions: undefined,
  headerShadowVisible: undefined,
  headerShown: false,
  headerTitle: undefined,
  headerTitleStyle: undefined,
  headerTransparent: undefined,
  unstable_headerLeftItems: undefined,
  unstable_headerRightItems: undefined,
};

const getHeaderItemIds = (items: HeaderItem[]): string[] =>
  items.flatMap(item => {
    if (item.type === 'custom') {
      return [];
    }
    return item.type === 'menu'
      ? [item.id, ...item.items.map(menuItem => menuItem.id)]
      : [item.id];
  });

export const getCurrentHeaderMetadata = (element: Element) =>
  getHeaderMetadata(element);

/**
 * Returns the native options that need to be applied before screen content.
 */
export const getHeaderOptions = (
  element: Element,
  callbacks: HeaderCallbacks,
  searchBinding?: NativeSearchBinding,
): NativeStackNavigationOptions | undefined => {
  const metadata = getCurrentHeaderMetadata(element);
  if (!metadata || !isLiquidGlassSupported()) {
    return undefined;
  }
  const targetIds = [
    ...getHeaderItemIds(metadata.left),
    ...getHeaderItemIds(metadata.right),
  ];
  if (targetIds.some(id => !callbacks.getElementById(id))) {
    return undefined;
  }
  const searchTarget = metadata.searchTarget
    ? callbacks.getElementById(metadata.searchTarget)
    : undefined;
  const hasSearch = metadata.searchPlaceholder !== undefined;
  if (
    hasSearch !== (metadata.searchTarget !== undefined) ||
    (searchTarget && searchTarget.localName !== 'text-field')
  ) {
    return undefined;
  }
  const leftItems = getNativeHeaderItems(metadata.left, callbacks);
  const rightItems = getNativeHeaderItems(metadata.right, callbacks);
  const titleElement = metadata.titleElement
    ? callbacks.renderItem(metadata.titleElement)
    : undefined;
  if (
    !leftItems ||
    !rightItems ||
    (metadata.titleElement && !titleElement) ||
    (hasSearch && !searchTarget)
  ) {
    return undefined;
  }
  const triggerSearch = (
    trigger: Parameters<HeaderCallbacks['onTrigger']>[0],
  ) => {
    if (metadata.searchTarget) {
      callbacks.onTrigger(trigger, metadata.searchTarget);
    }
  };
  const handleSearchChange = (value: string) => {
    if (!metadata.searchTarget) {
      return;
    }
    if (searchBinding) {
      searchBinding.onChangeText(metadata.searchTarget, value);
    } else {
      callbacks.onChangeText(metadata.searchTarget, value);
    }
  };
  return {
    headerBackVisible: false,
    headerBlurEffect: 'none',
    headerLargeTitleEnabled: metadata.titleMode === 'large',
    headerLargeTitleStyle: titleStyle,
    headerSearchBarOptions: metadata.searchPlaceholder
      ? {
          allowToolbarIntegration:
            !metadata.searchPlacement ||
            metadata.searchPlacement === 'automatic',
          hideWhenScrolling: false,
          onBlur: () => triggerSearch('blur'),
          onCancelButtonPress: () => handleSearchChange(''),
          onChangeText: event => handleSearchChange(event.nativeEvent.text),
          onFocus: () => triggerSearch('focus'),
          onSearchButtonPress: () => triggerSearch('submit'),
          placeholder: metadata.searchPlaceholder,
          placement: metadata.searchPlacement,
          ref: searchBinding?.ref,
        }
      : undefined,
    headerShadowVisible: false,
    headerShown: true,
    headerTitle: titleElement ? () => titleElement : metadata.title,
    headerTitleStyle: titleStyle,
    headerTransparent: true,
    unstable_headerLeftItems: leftItems.length ? () => leftItems : undefined,
    unstable_headerRightItems: rightItems.length ? () => rightItems : undefined,
  };
};
