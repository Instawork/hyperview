import * as Namespaces from 'hyperview/src/services/namespaces';
import type { OnScroll, Props, ScrollProps } from './types';
import {
  FlatList as RNFlatList,
  ScrollView as RNScrollView,
  SectionList as RNSectionList,
} from 'react-native';
import React, { forwardRef, useCallback, useContext } from 'react';
import { Context } from './context';
import HVKeyboardAwareScrollView from 'hyperview/src/core/components/keyboard-aware-scroll-view';

export function withContext<T, P extends ScrollProps>(
  Component: React.ComponentType<P>,
) {
  return forwardRef<T, P & Props<T>>((props: Props<T>, ref) => {
    const { updateOffset } = useContext(Context);
    const { element, onScroll, ...p } = props;
    const contextKey = element.getAttributeNS(
      Namespaces.HYPERVIEW_SCROLL,
      'context-key',
    );
    const scrollEventThrottle = parseInt(
      element.getAttributeNS(Namespaces.HYPERVIEW_SCROLL, 'event-throttle') ||
        '16',
      10,
    );
    const onScrollWrapper: OnScroll = useCallback(
      (event: Parameters<NonNullable<OnScroll>>[0]) => {
        if (contextKey) {
          const offset = event.nativeEvent.contentOffset;
          requestAnimationFrame(() => {
            updateOffset(contextKey, offset);
          });
        }
        if (onScroll) {
          onScroll(event);
        }
      },
      [updateOffset, onScroll, contextKey],
    );
    return (
      <Component
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(p as P)}
        ref={ref}
        onScroll={onScrollWrapper}
        scrollEventThrottle={scrollEventThrottle}
      />
    );
  });
}

export const FlatList = withContext<RNFlatList, RNFlatList['props']>(
  RNFlatList,
);
export const ScrollView = withContext<RNScrollView, RNScrollView['props']>(
  RNScrollView,
);
export const SectionList = withContext<RNSectionList, RNSectionList['props']>(
  RNSectionList,
);
export const KeyboardAwareScrollView = withContext<
  HVKeyboardAwareScrollView,
  HVKeyboardAwareScrollView['props']
>(HVKeyboardAwareScrollView);

export * from './context';
