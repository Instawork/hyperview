// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HvNamespace, NamespaceRegistry } from 'hyperview/src/types';

// Core Namespaces
export const HYPERVIEW = 'https://hyperview.org/hyperview';
export const HYPERVIEW_ALERT = 'https://hyperview.org/hyperview-alert';

// Custom namespaces
export const SHARE = 'https://instawork.com/hyperview-share';

export const HYPERVIEW_NAMESPACES = [HYPERVIEW];

export const getRegistry = (
  namespaces: HvNamespace[] = [],
): NamespaceRegistry =>
  [...HYPERVIEW_NAMESPACES, ...namespaces].reduce(
    (registry: NamespaceRegistry, namespace: HvNamespace) => [
      ...registry,
      namespace,
    ],
    [],
  );
