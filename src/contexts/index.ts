/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';
import type { ComponentType } from 'react';
import React from 'react';
import type { RefreshControlProps } from 'react-native';
import type { Document } from 'hyperview/src/types';

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

<<<<<<< HEAD
export const DocContext = React.createContext<(() => Document) | null>(null);
=======
export const DocContext = React.createContext<{
  getDoc: () => TypesLegacy.Document;
} | null>(null);
>>>>>>> master
