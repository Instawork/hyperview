/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  HvComponentOptions,
  StyleSheet,
  StyleSheets,
} from 'hyperview/src/types';

export function createProps(
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
): Record<string, string | boolean | number>;

export function createStyleProp(
  element: Element,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
): Array<StyleSheet>;
