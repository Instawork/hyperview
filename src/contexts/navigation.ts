/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as HvNavigatorProps from 'hyperview/src/core/components/hv-navigator/types';
import * as HvScreenProps from 'hyperview/src/core/components/hv-screen/types';
import type { ComponentType } from 'react';
import React from 'react';

// Provides the date format function to use in date fields
// in the screen. Default to ISO string format.
export const DateFormatContext = React.createContext<
  (date: Date | null | undefined, format: string | null | undefined) => string
>(date => (date ? date.toISOString() : ''));

export const RefreshControlComponentContext = React.createContext<
  ComponentType<object>
>(component => component);

type Props = HvScreenProps.ComponentProps &
  HvScreenProps.DataProps &
  HvNavigatorProps.ComponentProps;
/**
 * Context used by to provide values to the navigation components
 */
export const NavigationContext = React.createContext<Props | null>(null);
