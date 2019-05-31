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
  Document,
  Element,
  HvComponentOnUpdate,
  Node,
} from 'hyperview/src/types';
import { shallowCloneToRoot } from 'hyperview/src/services';

export default {
  action: 'select-option',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    doc: Document,
  ): ?Node => {
    const targetId: ?DOMString = element.getAttribute('target');
    if (targetId) {
      const targetElement: ?Element = doc.getElementById(targetId);
      if (targetElement) {
        targetElement.setAttribute('selected', 'true');
        targetElement.setAttribute('select-triggered', 'true');
        return shallowCloneToRoot(targetElement);
      }
    }
    return null;
  },
};
