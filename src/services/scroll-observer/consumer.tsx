import * as ScrollObserver from './context';
import type {
  ConsumerProps as Props,
  ScrollEvent,
  ScrollableComponentType,
} from './types';
import React, { PureComponent } from 'react';

export const withScrollableComponent = (
  ScrollableComponent: ScrollableComponentType,
  eventThrottle: number = 16,
) =>
  class ScrollableComponentConsumer extends PureComponent<Props> {
    static displayName = `${
      ScrollableComponent.displayName ||
      ScrollableComponent.name ||
      'ScrollableComponent'
    }Consumer`;

    render(): React.ReactNode {
      return (
        <ScrollObserver.Context.Consumer>
          {({ updateOffset }) => {
            return (
              <ScrollableComponent
                onScroll={(event: ScrollEvent) => {
                  if (this.props.id) {
                    const offset = event.nativeEvent.contentOffset;
                    requestAnimationFrame(() => {
                      if (this.props.id) {
                        updateOffset(this.props.id, offset);
                      }
                    });
                  }
                }}
                scrollEventThrottle={eventThrottle}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...this.props}
              />
            );
          }}
        </ScrollObserver.Context.Consumer>
      );
    }
  };
