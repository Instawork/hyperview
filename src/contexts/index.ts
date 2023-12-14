/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  HvComponentOnUpdate,
  ScreenState,
  Trigger,
} from 'hyperview/src/types';
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

export const OnUpdateContext = React.createContext<{
  onUpdate: HvComponentOnUpdate;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ onUpdate: () => {} });

export type SetState = (
  state:
    | ScreenState
    | ((
        prevState: Readonly<ScreenState>,
        props: Readonly<unknown>,
      ) => ScreenState),
  callback?: () => void,
) => void;

export type DocStateContextProps = {
  getState: () => ScreenState;
  setState: SetState;
};

export const DocStateContext = React.createContext<DocStateContextProps>({
  getState: () => {
    return {};
  },
  setState: () => {},
});

export type ElementRegistryContextProps = {
  addElements: (trigger: Trigger, elements: Element[]) => void;
  getElements: (trigger: Trigger) => Element[];
  removeElements: (trigger: Trigger, elements: Element[]) => void;
};

/**
 * Allows caching and retrieving elements by trigger
 */
export const ElementRegistryContext = React.createContext<ElementRegistryContextProps>(
  {
    addElements: () => {},
    getElements: () => [],
    removeElements: () => {},
  },
);
