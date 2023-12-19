/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ComponentType } from 'react';
import React from 'react';
import type { RefreshControlProps } from 'react-native';
import type { ScreenState } from 'hyperview/src/types';

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

export type SetState = (
  state:
    | ScreenState
    | ((
        prevState: Readonly<ScreenState>,
        props: Readonly<unknown>,
      ) => ScreenState),
  callback?: () => void,
) => void;

export class BackBehaviorElements {
  backBehaviorElements: Element[] = [];

  add = (elements: Element[]): void => {
    this.backBehaviorElements.push(...elements);
  };

  get = (): Element[] => this.backBehaviorElements;

  remove = (elements: Element[]): void => {
    this.backBehaviorElements = elements.reduce((acc, e) => {
      const i = acc.indexOf(e);
      return i > -1 ? [...acc.slice(0, i), ...acc.slice(i + 1)] : acc;
    }, this.backBehaviorElements);
  };
}

export type DocContextProps = {
  backBehaviorElements: BackBehaviorElements;
  getState: () => ScreenState;
  setState: SetState;
};

export const DocContext = React.createContext<DocContextProps>({
  backBehaviorElements: new BackBehaviorElements(),
  getState: () => {
    return {};
  },
  setState: () => {},
});
