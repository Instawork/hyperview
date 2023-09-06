/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';

export const getKeyboardDismissMode = (
  element: TypesLegacy.Element,
): 'on-drag' | undefined => {
  return element.getAttribute('dismiss-keyboard-on-drag') === 'true'
    ? 'on-drag'
    : undefined;
};
