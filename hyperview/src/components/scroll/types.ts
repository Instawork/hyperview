import type { ReactNode, Ref } from 'react';
import type { ScrollViewProps } from 'react-native';

export type ScrollOffset = {
  x: number;
  y: number;
};

export type Offsets = { [key: string]: ScrollOffset };

export type OnScroll = ScrollViewProps['onScroll'];

export type ContextValue = {
  automaticContentInsets: boolean;
  offsets: Offsets;
  updateOffset: (viewId: string, offset: ScrollOffset) => void;
};

export type ProviderProps = {
  automaticContentInsets: boolean;
  children: ReactNode;
};

export type ScrollProps = {
  contentInsetAdjustmentBehavior?: ScrollViewProps['contentInsetAdjustmentBehavior'];
  horizontal?: ScrollViewProps['horizontal'];
  onScroll?: OnScroll;
  scrollEventThrottle?: ScrollViewProps['scrollEventThrottle'];
};

export type Props<T> = ScrollProps & {
  element: Element;
  ref?: Ref<T> | undefined;
};
