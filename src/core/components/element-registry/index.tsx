/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from 'hyperview/src/contexts';
import * as Types from './types';
import React, { PureComponent } from 'react';
import { Trigger } from 'hyperview/src/types';

/**
 * Provides a registry context for hv-route and hyper-ref components to share elements
 */
export default class ElementRegistry extends PureComponent<Types.Props> {
  // Cache elements by trigger
  elementRegistry: { [trigger: string]: Element[] };

  constructor(props: Types.Props) {
    super(props);
    this.elementRegistry = {};
  }

  render(): React.ReactNode {
    return (
      <Contexts.ElementRegistryContext.Provider
        value={{
          addElements: (t: Trigger, elements: Element[]): void => {
            const registry = this.elementRegistry[t.toString()] || [];
            if (elements?.length > 0) {
              elements.forEach(e => {
                registry.push(e);
              });
            }
            this.elementRegistry[t.toString()] = registry;
          },
          getElements: (t: Trigger): Element[] =>
            this.elementRegistry[t.toString()] || [],
          removeElements: (t: Trigger, elements: Element[]): void => {
            const registry = this.elementRegistry[t.toString()] || [];
            if (elements?.length > 0 && registry.length > 0) {
              elements.forEach(e => {
                const ind = registry.indexOf(e);
                if (ind > -1) {
                  registry.splice(ind, 1);
                }
              });
            }
          },
        }}
      >
        {this.props.children}
      </Contexts.ElementRegistryContext.Provider>
    );
  }
}
