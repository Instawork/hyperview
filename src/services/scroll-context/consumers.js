// @flow

import type { ConsumerProps as Props, ScrollEvent } from './types';
import React, { PureComponent } from 'react';
import { ScrollContext } from './context';

export const withScrollableComponent = (ScrollableComponent: any) =>
  class ScrollableComponentWithScrollContextConsumer extends PureComponent<Props> {
    id: string;
    props: Props;

    static displayName = `${ScrollableComponent.displayName ||
      ScrollableComponent.name ||
      'ScrollableComponent'}WithScrollContextConsumer`;

    render() {
      return (
        <ScrollContext.Consumer>
          {({ updateOffset }) => (
            <ScrollableComponent
              onScroll={(event: ScrollEvent) => {
                if (this.props.id) {
                  const id = this.props.id;
                  const offset = event.nativeEvent.contentOffset;
                  requestAnimationFrame(() => {
                    updateOffset(id, offset);
                  });
                }
              }}
              scrollEventThrottle={16}
              {...this.props}
            />
          )}
        </ScrollContext.Consumer>
      );
    }
  };
