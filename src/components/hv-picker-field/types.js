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
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';

export type Props = {|
  element: Element,
  options: HvComponentOptions,
  stylesheets: StyleSheets,
|};

export type State = {|
  value: ?string,
  pickerValue: ?string,
  showPicker: boolean,
  fieldPressed: boolean,
  savePressed: boolean,
  cancelPressed: boolean,
|};
