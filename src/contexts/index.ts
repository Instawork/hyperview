/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {ComponentType} from 'react';
import React from 'react';

// Provides the date format function to use in date fields
// in the screen. Default to ISO string format.
export const DateFormatContext = React.createContext<(date?: Date | null | undefined, format?: string | null | undefined) => string>(date => (date ? date.toISOString() : ''));

export const RefreshControlComponentContext = React.createContext<ComponentType<any>>(component => component);
