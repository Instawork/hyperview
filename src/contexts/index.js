// @flow

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
  (date: ?Date, format: ?string) => string,
>(date => (date ? date.toISOString() : ''));

export const RefreshControlComponentContext = React.createContext<
  ComponentType<*>,
>(component => component);

/**
 * Context used by to provide values to the navigation components
 */
export const NavigationContext = React.createContext<
  HvScreenProps.ComponentProps &
    HvScreenProps.DataProps &
    HvNavigatorProps.ComponentProps,
>(
  behaviors => behaviors,
  components => components,
  elementErrorComponent => elementErrorComponent,
  errorScreen => errorScreen,
  loadingScreen => loadingScreen,
  refreshControl => refreshControl,
  entrypointUrl => entrypointUrl,
  fetch => fetch,
  formatDate => formatDate,
  onParseBefore => onParseBefore,
  onParseAfter => onParseAfter,
  handleBack => handleBack,
);
