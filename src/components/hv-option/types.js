/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { Animations, Element, HvComponentOnUpdate, HvComponentOptions, StyleSheets } from 'hyperview/src/types';

export type Props = {|
  animations: ?Animations,
  element: Element,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};

export type State = {|
  pressed: boolean,
|};
