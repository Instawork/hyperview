// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ComponentType } from 'react';
import { Props as ErrorProps } from 'hyperview/src/core/components/load-error/types';
import { Props as LoadingProps } from 'hyperview/src/core/components/loading/types';
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
 * Context used by to provide values to the navigation stack.
 */
export const NavigationContext = React.createContext<{
  entrypointUrl: string,
  errorScreen: ?React.Component<ErrorProps>,
  fetch: (input: string, init: ?Object) => string,
  loadingScreen: ?React.Component<LoadingProps>,
  onParseAfter: ?(url: string) => void,
  onParseBefore: ?(url: string) => void,
}>(
  entrypointUrl => entrypointUrl,
  errorScreen => errorScreen,
  fetch => fetch,
  loadingScreen => loadingScreen,
  onParseBefore => onParseBefore,
  onParseAfter => onParseAfter,
);
