// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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

export const FetchContext = React.createContext<{
  fetch: (input: String, init: ?Object) => string,
  onParseBefore: (url: String) => void,
  onParseAfter: (url: String) => void,
}>(
  fetch => fetch,
  onParseBefore => onParseBefore,
  onParseAfter => onParseAfter,
);
