import type { HeaderNavigation, NativeHeaderOptions } from './types';
import {
  createNavigationContainerRef,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  getHeaderMetadata,
  getNativeHeaderItems,
  getStackHeaderNavigation,
} from './helpers';
import { useLayoutEffect, useMemo, useRef } from 'react';
import type { HeaderViewProps } from 'hyperview';
import type { ParamListBase } from '@react-navigation/native';
import { isLiquidGlassSupported } from '../BottomTabView/helpers';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

const titleStyle = {
  fontSize: 24,
  fontWeight: '600' as const,
};

const resetHeaderOptions: NativeHeaderOptions = {
  headerBackVisible: undefined,
  headerBlurEffect: undefined,
  headerLargeTitleEnabled: undefined,
  headerLargeTitleStyle: undefined,
  headerShadowVisible: undefined,
  headerShown: false,
  headerTitleStyle: undefined,
  headerTransparent: undefined,
  title: undefined,
  unstable_headerLeftItems: undefined,
  unstable_headerRightItems: undefined,
};

const getLeftRole = () => {
  if (!navigationRef.isReady() || !navigationRef.canGoBack()) {
    return undefined;
  }
  const routeParams = navigationRef.getCurrentRoute()?.params as
    | { isModal?: boolean }
    | undefined;
  return routeParams?.isModal ? 'close' : 'back';
};

/**
 * Returns the native options that need to be applied before screen content.
 */
export const getHeaderOptions = (
  element: Element,
  onPress: HeaderViewProps['onPress'],
): NativeHeaderOptions | undefined => {
  const metadata = getHeaderMetadata(element, getLeftRole());
  if (!metadata || !isLiquidGlassSupported()) {
    return undefined;
  }
  const leftItems = getNativeHeaderItems(metadata.left, onPress);
  const rightItems = getNativeHeaderItems(metadata.right, onPress);
  return {
    headerBackVisible: false,
    headerBlurEffect: 'none',
    headerLargeTitleEnabled: metadata.titleMode === 'large',
    headerLargeTitleStyle: titleStyle,
    headerShadowVisible: false,
    headerShown: true,
    headerTitleStyle: titleStyle,
    headerTransparent: true,
    title: metadata.title,
    unstable_headerLeftItems: leftItems?.length ? () => leftItems : undefined,
    unstable_headerRightItems: rightItems?.length
      ? () => rightItems
      : undefined,
  };
};

export const HeaderView = ({
  children,
  element,
  isRouteLoading,
  onPress,
}: HeaderViewProps) => {
  const navigation = useNavigation<HeaderNavigation>();
  const headerNavigation = getStackHeaderNavigation(navigation);
  const isFocused = useIsFocused();
  const isFocusedRef = useRef(isFocused);
  isFocusedRef.current = isFocused;
  const suppressLoadingHeader = Boolean(
    isRouteLoading && isLiquidGlassSupported(),
  );
  const headerOptions = useMemo(() => {
    if (suppressLoadingHeader) {
      return undefined;
    }
    return getHeaderOptions(element, onPress);
  }, [element, onPress, suppressLoadingHeader]);

  useLayoutEffect(() => {
    if (headerOptions && isFocused) {
      headerNavigation.setOptions(headerOptions);
    }
  }, [isFocused, headerOptions, headerNavigation]);
  useLayoutEffect(() => {
    if (!headerOptions) {
      return undefined;
    }
    return () => {
      if (isFocusedRef.current) {
        headerNavigation.setOptions(resetHeaderOptions);
      }
    };
  }, [headerNavigation, headerOptions]);

  return suppressLoadingHeader || headerOptions ? null : children;
};

HeaderView.getOptions = getHeaderOptions;
