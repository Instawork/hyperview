// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMString, StyleSheet } from 'hyperview/src/types';

export type InternalProps = {|
  accessibilityLabel?: any,
  automaticallyAdjustContentInsets?: ?boolean,
  behavior?: 'position',
  contentContainerStyle?: Array<StyleSheet>,
  extraScrollHeight?: ?number,
  keyboardOpeningTime?: ?number,
  keyboardShouldPersistTaps?: ?string,
  scrollEventThrottle?: ?number,
  scrollToInputAdditionalOffset?: ?number,
  showsHorizontalScrollIndicator?: ?boolean,
  showsVerticalScrollIndicator?: ?boolean,
  getTextInputRefs?: ?() => [],
  horizontal?: ?boolean,
  style?: ?Array<StyleSheet>,
  testID?: ?string,
  children?: ?any,
  scrollIndicatorInsets?: {
    bottom?: number,
    left?: number,
    right?: number,
    top?: number,
  },
  stickyHeaderIndices?: ?(number[]),
|};

export const ATTRIBUTES = {
  AVOID_KEYBOARD: 'avoid-keyboard',
  CONTENT_CONTAINER_STYLE: 'content-container-style',
  SAFE_AREA: 'safe-area',
  SCROLL: 'scroll',
  SCROLL_ORIENTATION: 'scroll-orientation',
  SCROLL_TO_INPUT_OFFSET: 'scroll-to-input-offset',
  SHOWS_SCROLL_INDICATOR: 'shows-scroll-indicator',
};

export type Attribute = $Values<typeof ATTRIBUTES>;

// eslint-disable-next-line instawork/exact-object-types
export type Attributes = {
  'avoid-keyboard'?: ?DOMString,
  'content-container-style'?: ?DOMString,
  'safe-area'?: ?DOMString,
  scroll?: ?DOMString,
  'scroll-orientation'?: ?DOMString,
  'scroll-to-input-offset'?: ?DOMString,
  'shows-scroll-indicator'?: ?DOMString,
};
