/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';

type KeyboardDismissMode = 'none' | 'on-drag' | 'interactive';

export const getKeyboardDismissMode = (
  element: TypesLegacy.Element,
): KeyboardDismissMode | undefined => {
  const mode = element.getAttribute('keyboard-dismiss-mode');
  switch (mode) {
    case 'none':
    case 'on-drag':
    case 'interactive':
      return mode;
    default:
      return undefined;
  }
};
