/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

/**
 * Props used by hv-navigator
 */
export type ComponentProps = {
  handleBack?: React.ComponentType<{ children: React.ReactNode }>;
};
