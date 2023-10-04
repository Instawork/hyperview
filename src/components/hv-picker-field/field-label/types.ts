/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMString, StyleSheet } from 'hyperview/src/types';

export type Props = {
  focused: boolean;
  labelFormat: string | null | undefined;
  placeholder: string | null | undefined;
  placeholderTextColor: string | null | undefined;
  pressed: boolean;
  style: StyleSheet;
  value: DOMString | null | undefined;
};
