/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';

import type { ReactNode } from 'react';

export type Props = {
  children: ReactNode;
  element: Element;
  isFocused: () => boolean;
  onModalCancel: () => void;
  onModalDone: () => void;
  onUpdate: HvComponentOnUpdate;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
};
