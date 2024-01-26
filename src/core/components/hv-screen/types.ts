/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HvComponentOnUpdate, Reload } from 'hyperview/src/types';
import { Props as HvRootProps } from 'hyperview/src/core/components/hv-root/types';

/**
 * All of the props used by hv-screen
 */
export type Props = HvRootProps & {
  onUpdate: HvComponentOnUpdate;
  reload: Reload;
};
