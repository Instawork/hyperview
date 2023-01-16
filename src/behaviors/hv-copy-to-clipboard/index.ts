/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {Clipboard} from 'react-native';
import type { Element } from 'hyperview/src/types';

export default {
  action: 'copy-to-clipboard',
  callback: (element: Element) => {
    const value: string | null | undefined = element.getAttribute('value');
    if (!value) {
      console.warn('[behaviors/copy-to-clipboard]: missing "value" attribute');
      return;
    }
    Clipboard.setString(value);
  },
};
