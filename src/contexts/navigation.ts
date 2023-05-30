/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ComponentProps,
  DataProps,
} from 'hyperview/src/core/components/hv-screen/types';
import React from 'react';

export type NavigationContextProps = DataProps & ComponentProps;

/**
 * Context used by to provide initial values to the navigation components
 */
export const NavigationContext = React.createContext<NavigationContextProps | null>(
  null,
);
