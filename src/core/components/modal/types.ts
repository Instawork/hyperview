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

export type Props = {
  children: Node;
  element: Element;
  isFocused: () => boolean;
  onModalCancel: () => void;
  onModalDone: () => void;
  onUpdate: HvComponentOnUpdate;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};
