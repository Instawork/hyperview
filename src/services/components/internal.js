// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HvComponent } from 'hyperview/src/types';

export const registerComponent = (
  component: HvComponent,
): { [string]: HvComponent } =>
  [component.localName, ...(component.localNameAliases || [])].reduce(
    (acc, localName: string) => ({
      ...acc,
      [localName]: component,
    }),
    {},
  );
