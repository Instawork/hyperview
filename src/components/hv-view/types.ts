/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMString } from 'hyperview/src/types';
import type { StyleProp, ViewStyle } from 'react-native';

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
  accessibilityLabel?: string | null | undefined;
  testID?: string | null | undefined;
  children?: any | null | undefined;
  style?: StyleProp<ViewStyle> | null | undefined;
};

export type ScrollViewProps = {
  accessibilityLabel?: string | null | undefined;
  testID?: string | null | undefined;
  children?: any | null | undefined;
  style?: StyleProp<ViewStyle> | null | undefined;
  contentContainerStyle?: StyleProp<ViewStyle> | null | undefined;
  horizontal?: boolean | null | undefined;
  keyboardDismissMode?: 'none' | 'on-drag' | 'interactive' | null | undefined;
  scrollIndicatorInsets?: Readonly<{
    bottom?: number | null | undefined;
    left?: number | null | undefined;
    right?: number | null | undefined;
    top?: number | null | undefined;
  }>;
  showsHorizontalScrollIndicator?: boolean | null | undefined;
  showsVerticalScrollIndicator?: boolean | null | undefined;
  stickyHeaderIndices?: number[] | null | undefined;
};

export type KeyboardAwareScrollViewProps = {
  accessibilityLabel?: string | null | undefined;
  testID?: string | null | undefined;
  children?: any | null | undefined;
  style?: StyleProp<ViewStyle> | null | undefined;
  automaticallyAdjustContentInsets?: boolean | null | undefined;
  getTextInputRefs?: () => Array<any> | null | undefined;
  keyboardShouldPersistTaps?: string | null | undefined;
  scrollEventThrottle?: number | null | undefined;
  scrollToInputAdditionalOffset?: number | null | undefined;
};
