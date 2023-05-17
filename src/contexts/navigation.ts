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
import type { RefreshControlProps } from 'react-native';

// Provides the date format function to use in date fields
// in the screen. Default to ISO string format.
export const DateFormatContext = React.createContext<
  (
    date: Date | null | undefined,
    format: string | undefined,
  ) => string | undefined
>(date => (date ? date.toISOString() : ''));

export const RefreshControlComponentContext = React.createContext<
  ComponentType<RefreshControlProps> | undefined
>(undefined);

export type NavigationContextProps = HvScreenProps.DataProps &
  HvScreenProps.ComponentProps &
  HvNavigatorProps.ComponentProps;

/**
 * Context used by to provide values to the navigation components
 */
export const NavigationContext = React.createContext<NavigationContextProps | null>(
  null,
);
