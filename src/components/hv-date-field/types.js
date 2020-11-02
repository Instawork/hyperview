// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import type {
  Element,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import type { StyleSheet as StyleSheetType } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type FieldProps = {|
  children?: React.Node,
  element: Element,
  focused: boolean,
  onPress: () => void,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
  value: ?Date,
|};

export type FieldLabelProps = {|
  focused: boolean,
  formatter: (value: ?Date, format: ?string) => string,
  labelFormat: ?string,
  placeholder: ?string,
  placeholderTextColor: ?string,
  pressed: boolean,
  style: StyleSheetType<*>,
  value: ?Date,
|};

export type ModalButtonProps = {|
  getStyle: (pressed: boolean) => Array<StyleSheetType<*>>,
  label: string,
  onPress: () => void,
|};
