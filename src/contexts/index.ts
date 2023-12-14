/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HvComponentOnUpdate, ScreenState } from 'hyperview/src/types';
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

export type BackBehaviorElements = {
  add: (elements: Element[]) => void;
  get: () => Element[];
  remove: (elements: Element[]) => void;
};

export type DocContextProps = {
  backBehaviorElements: BackBehaviorElements;
  getState: () => ScreenState;
  setState: SetState;
};

export const DocContext = React.createContext<DocContextProps>({
  backBehaviorElements: {
    add: () => {},
    get: () => [],
    remove: () => {},
  },
  getState: () => {
    return {};
  },
  setState: () => {},
});
