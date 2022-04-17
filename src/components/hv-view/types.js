// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { StyleSheet } from 'hyperview/src/types';

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
  stickyHeaderIndices?: ?(number[]),
|};
