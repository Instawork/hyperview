/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMString,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import { ReactNode } from 'react';

export type Props = {
  children?: ReactNode;
  element: Element;
  focused: boolean;
  onPress: () => void;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
  value: DOMString | null | undefined;
};
