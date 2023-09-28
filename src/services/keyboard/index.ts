/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

<<<<<<< HEAD
import type { Element } from 'hyperview/src/types';
=======
import * as TypesLegacy from 'hyperview/src/types-legacy';
>>>>>>> master

type KeyboardDismissMode = 'none' | 'on-drag' | 'interactive';

export const getKeyboardDismissMode = (
<<<<<<< HEAD
  element: Element,
=======
  element: TypesLegacy.Element,
>>>>>>> master
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
