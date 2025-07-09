import React from 'react';
import type { ScrollViewProps } from 'react-native';

export type ScrollOffset = {
  x: number;
  y: number;
};

export type Offsets = { [key: string]: ScrollOffset };

export type OnScroll = ScrollViewProps['onScroll'];

export type ScrollProps = {
  onScroll?: OnScroll;
  scrollEventThrottle?: ScrollViewProps['scrollEventThrottle'];
};

export type Props<T> = {
  element: Element;
  onScroll?: OnScroll;
  scrollEventThrottle?: ScrollViewProps['scrollEventThrottle'];
  ref?: React.Ref<T> | undefined;
};
