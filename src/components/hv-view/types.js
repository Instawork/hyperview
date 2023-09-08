// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMString } from 'hyperview/src/types';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

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

export type CommonProps = {|
  accessibilityLabel?: ?string,
  testID?: ?string,
  children?: ?any,
  style?: ?ViewStyleProp,
|};

export type ScrollViewProps = {|
  accessibilityLabel?: ?string,
  testID?: ?string,
  children?: ?any,
  style?: ?ViewStyleProp,
  contentContainerStyle?: ?ViewStyleProp,
  horizontal?: ?boolean,
  keyboardDismissMode?: ?('none' | 'on-drag' | 'interactive'),
  scrollIndicatorInsets?: $ReadOnly<{|
    bottom?: ?number,
    left?: ?number,
    right?: ?number,
    top?: ?number,
  |}>,
  showsHorizontalScrollIndicator?: ?boolean,
  showsVerticalScrollIndicator?: ?boolean,
  stickyHeaderIndices?: ?(number[]),
|};

export type KeyboardAwareScrollViewProps = {|
  accessibilityLabel?: ?string,
  testID?: ?string,
  children?: ?any,
  style?: ?ViewStyleProp,
  automaticallyAdjustContentInsets?: ?boolean,
  getTextInputRefs?: ?() => Array<any>,
  keyboardShouldPersistTaps?: ?string,
  scrollEventThrottle?: ?number,
  scrollToInputAdditionalOffset?: ?number,
|};
