/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as HvScreenProps from 'hyperview/src/core/components/hv-screen/types';
import React from 'react';

/**
 * Props used by hv-navigator
 */
export type ComponentProps = {
  handleBack: React.ComponentType;
};

/**
 * All of the props used by hv-navigator
 */
export type Props = HvScreenProps.NavigationProps &
  HvScreenProps.DataProps &
  HvScreenProps.HvScreenProps;
