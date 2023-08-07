// @flow

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
import type { ComponentType } from 'react';

export type Props = {|
  element: Element,
  getPickerValue: () => ?Date,
  isFocused: () => boolean,
  onModalCancel: () => void,
  onModalDone: (date: ?Date) => void,
  onUpdate: HvComponentOnUpdate,
  options: HvComponentOptions,
  PickerComponent: ComponentType<*>,
  setPickerValue: (value: ?Date) => void,
  stylesheets: StyleSheets,
|};
