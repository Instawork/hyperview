// @flow

import React, { PureComponent } from 'react';
import type { ScrollOffset, State } from './types';
import { ScrollContext } from './context';

export const withProvider = (Component: any) =>
  class ComponentWithScrollContextProvider extends PureComponent<*, State> {
    state: State = {
      scrollOffsets: {},
    };
    updateOffset = (viewId: string, offset: ScrollOffset) => {
      this.setState({
        scrollOffsets: {
          ...this.state.scrollOffsets,
          [viewId]: offset,
        },
      });
    };
    render() {
      return (
        <ScrollContext.Provider
          value={{
            offsets: this.state.scrollOffsets,
            updateOffset: this.updateOffset,
          }}
        >
          <Component {...this.props} />
        </ScrollContext.Provider>
      );
    }
  };
