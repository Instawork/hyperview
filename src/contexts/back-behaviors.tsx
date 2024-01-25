/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode, createContext, useRef, useState } from 'react';
import { HvComponentOnUpdate } from 'hyperview/src/types';

class BackBehaviorRegistry {
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

export type BackBehaviorContextProps = {
  add: (elements: Element[], onUpdate: HvComponentOnUpdate) => void;
  get: () => Element[];
  onUpdate: HvComponentOnUpdate;
  remove: (elements: Element[]) => void;
};

/*
 * Provides a registry of back behaviors to allow sharing between hv-screen and hv-route
 * Additionally contains the onUpdate to use for the behaviors
 */
export const BackBehaviorContext = createContext<BackBehaviorContextProps | null>(
  null,
);

export function BackBehaviorProvider(props: { children: ReactNode }) {
  const registry = useRef<BackBehaviorRegistry>(new BackBehaviorRegistry());
  const [onUpdate, setOnUpdate] = useState<HvComponentOnUpdate>(() => null);

  const add = (elements: Element[], update: HvComponentOnUpdate): void => {
    if (elements.length === 0) {
      return;
    }
    registry.current.add(elements);
    setOnUpdate(() => update);
  };

  const get = (): Element[] => registry.current.get();

  const remove = (elements: Element[]): void => {
    registry.current.remove(elements);
  };

  return (
    <BackBehaviorContext.Provider
      value={{
        add,
        get,
        onUpdate,
        remove,
      }}
    >
      {props.children}
    </BackBehaviorContext.Provider>
  );
}
