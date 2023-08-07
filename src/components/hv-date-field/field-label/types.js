// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { StyleSheet } from 'hyperview/src/types';

export type Props = {|
  focused: boolean,
  formatter: (value: ?Date, format: ?string) => string,
  labelFormat: ?string,
  placeholder: ?string,
  placeholderTextColor: ?string,
  pressed: boolean,
  style: StyleSheet,
  value: ?Date,
|};
