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

export class BackBehaviorElements {
  backBehaviorElements: Element[] = [];

  add = (elements: Element[]): void => {
    this.backBehaviorElements.push(...elements);
  };

  get = (): Element[] => this.backBehaviorElements;

  remove = (elements: Element[]): void => {
    if (elements.length > 0) {
      console.log(
        `Removing ${elements.length} elements from backBehaviorElements cur length: ${this.backBehaviorElements.length}`,
      );
    }
    this.backBehaviorElements = elements.reduce((acc, e) => {
      const i = acc.indexOf(e);
      return i > -1 ? [...acc.slice(0, i), ...acc.slice(i + 1)] : acc;
    }, this.backBehaviorElements);
    if (elements.length > 0) {
      console.log(
        `backBehaviorElements now has ${this.backBehaviorElements.length} elements`,
      );
    }
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
