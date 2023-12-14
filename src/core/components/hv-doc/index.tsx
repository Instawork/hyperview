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
import { ScreenState } from 'hyperview/src/types';

/**
 * Provides a state context for hv-route and hv-screen components.
 * Provides a behavior element cache for hv-route and hyper-ref components.
 */
export default class HvDoc extends PureComponent<Types.Props, ScreenState> {
  // <HACK>
  // In addition to storing the document on the react state, we keep a reference to it
  // on the instance. When performing batched updates on the DOM, we need to ensure every
  // update occurence operates on the latest DOM version. We cannot rely on `state` right after
  // setting it with `setState`, because React does not guarantee the new state to be immediately
  // available (see details here: https://reactjs.org/docs/react-component.html#setstate)
  // This component captures the incoming doc and stores it into localDoc
  //  to be injected into the returned state.
  // </HACK>
  localDoc: Document | null = null;

  // Cache elements
  backBehaviorElementCache: Element[];

  constructor(props: Types.Props) {
    super(props);
    this.state = {
      doc: null,
      elementError: null,
      error: null,
      staleHeaderType: null,
      styles: null,
      url: null,
    };
    this.backBehaviorElementCache = [];
  }

  render(): React.ReactNode {
    return (
      <Contexts.DocContext.Provider
        value={{
          backBehaviorElements: {
            add: (elements: Element[]): void => {
              if (elements?.length > 0) {
                elements.forEach(e => {
                  this.backBehaviorElementCache.push(e);
                });
              }
            },
            get: (): Element[] => this.backBehaviorElementCache,
            remove: (elements: Element[]): void => {
              if (
                elements?.length > 0 &&
                this.backBehaviorElementCache.length > 0
              ) {
                elements.forEach(e => {
                  const ind = this.backBehaviorElementCache.indexOf(e);
                  if (ind > -1) {
                    this.backBehaviorElementCache.splice(ind, 1);
                  }
                });
              }
            },
          },
          getState: (): ScreenState => {
            return { ...this.state, doc: this.localDoc };
          },
          setState: (s): void => {
            if (typeof s === 'object') {
              if (s.doc !== undefined) {
                this.localDoc = s.doc;
              }
              this.setState(s);
            } else if (typeof s === 'function') {
              this.setState((prevState, props) => {
                const newState = s(prevState, props);
                if (newState.doc !== undefined) {
                  this.localDoc = newState.doc;
                }
                return newState;
              });
            }
          },
        }}
      >
        {this.props.children}
      </Contexts.DocContext.Provider>
    );
  }
}
