// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { StyleSheet } from 'hyperview/src/types';

export type CodeInputProps = {|
  codeLength: number,
  codeArr: Array<string>,
  currentIndex: number,
  autoFocus: boolean,
  secureTextEntry: boolean,
  codeInputStyle: Array<StyleSheet>,
  focusedCodeInputStyle: Array<StyleSheet>,
  containerStyle: Array<StyleSheet>,
  onFulfill: (code: string) => void,
  keyboardType: ?any,
  updateState: (code: Array<string>, index: number) => void,
|};
