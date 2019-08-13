// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { BehaviorRegistry, HvBehavior } from 'hyperview/src/types';
import HvAlert from 'hyperview/src/behaviors/hv-alert';
import HvShare from 'hyperview/src/behaviors/hv-share';
import HvToggle from 'hyperview/src/behaviors/hv-toggle';

const HYPERVIEW_BEHAVIORS = [HvAlert, HvShare, HvToggle];

export const getRegistry = (behaviors: HvBehavior[] = []): BehaviorRegistry =>
  [...HYPERVIEW_BEHAVIORS, ...behaviors].reduce(
    (registry, behavior) => ({
      ...registry,
      [behavior.action]: behavior,
    }),
    {},
  );
