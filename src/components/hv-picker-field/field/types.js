// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMString,
  Element,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import type { Node } from 'react';

export type Props = {|
  children?: Node,
  element: Element,
  focused: boolean,
  onPress: ?() => void,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
  value: ?DOMString,
|};
