import type { StyleProp, ViewStyle } from 'react-native';
import type { DOMString } from 'hyperview/src/types';

export const ATTRIBUTES = {
  AVOID_KEYBOARD: 'avoid-keyboard',
  CONTENT_CONTAINER_STYLE: 'content-container-style',
  SAFE_AREA: 'safe-area',
  SCROLL: 'scroll',
  SCROLL_ORIENTATION: 'scroll-orientation',
  SCROLL_TO_INPUT_OFFSET: 'scroll-to-input-offset',
  SHOWS_SCROLL_INDICATOR: 'shows-scroll-indicator',
} as const;

export type Attribute = typeof ATTRIBUTES[keyof typeof ATTRIBUTES];

// eslint-disable-next-line instawork/exact-object-types
export type Attributes = {
  ['avoid-keyboard']?: DOMString | null | undefined;
  ['content-container-style']?: DOMString | null | undefined;
  ['safe-area']?: DOMString | null | undefined;
  scroll?: DOMString | null | undefined;
  ['scroll-orientation']?: DOMString | null | undefined;
  ['scroll-to-input-offset']?: DOMString | null | undefined;
  ['shows-scroll-indicator']?: DOMString | null | undefined;
};

export type CommonProps = {
  accessibilityLabel?: string | undefined;
  testID?: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any | undefined;
  style?: StyleProp<ViewStyle> | undefined;
};

export type ScrollViewProps = {
  accessibilityLabel?: string | undefined;
  testID?: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any | undefined;
  style?: StyleProp<ViewStyle> | undefined;
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  horizontal?: boolean | undefined;
  keyboardDismissMode?: 'none' | 'on-drag' | 'interactive' | undefined;
  scrollIndicatorInsets?: Readonly<{
    bottom?: number | undefined;
    left?: number | undefined;
    right?: number | undefined;
    top?: number | undefined;
  }>;
  showsHorizontalScrollIndicator?: boolean | undefined;
  showsVerticalScrollIndicator?: boolean | undefined;
  stickyHeaderIndices?: number[] | undefined;
};

export type KeyboardAwareScrollViewProps = {
  accessibilityLabel?: string | null | undefined;
  testID?: string | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any | null | undefined;
  style?: StyleProp<ViewStyle> | null | undefined;
  automaticallyAdjustContentInsets?: boolean | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTextInputRefs?: () => Array<any> | null | undefined;
  keyboardShouldPersistTaps?: string | null | undefined;
  scrollEventThrottle?: number | null | undefined;
  scrollToInputAdditionalOffset?: number | null | undefined;
};
