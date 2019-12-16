// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  Element,
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import type { StyleSheet } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type Props = {|
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};

export type InternalProps = {|
  accessibilityLabel?: ?string,
  extraScrollHeight?: ?number,
  keyboardOpeningTime?: ?number,
  keyboardShouldPersistTaps?: ?string,
  scrollEventThrottle?: ?number,
  getTextInputRefs?: ?() => [],
  horizontal?: ?boolean,
  style?: ?Array<StyleSheet<*>>,
  testID?: ?string,
|};
