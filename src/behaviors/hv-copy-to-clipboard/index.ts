/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Clipboard } from 'react-native';

export default {
  action: 'copy-to-clipboard',
  callback: (element: Element) => {
    const attributeName = 'copy-to-clipboard-value';
    const value: string | null | undefined = element.getAttribute(
      attributeName,
    );
    if (!value) {
      console.warn(
        `[behaviors/copy-to-clipboard]: missing "${attributeName}" attribute`,
      );
      return;
    }
    Clipboard.setString(value);
  },
};
