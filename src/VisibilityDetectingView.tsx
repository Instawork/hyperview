import { Dimensions, UIManager, View } from 'react-native';
import React, { PureComponent } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ElementRef } from 'react';

const TICK_INTERVAL = 100;

type Props = {
  id: string;
  onInvisible: () => void | null | undefined;
  onVisible: () => void | null | undefined;
  style: StyleProp<ViewStyle> | null | undefined;
  children?: React.ReactNode | undefined;
};

/** A view that lets you know when its contents become visible/invisible in the screen.
 *  Useful for progressively loading content in a scroll view.
 *  Uses a timer internally to periodically check whether or not it is visible/invisible
 */
export default class VisibilityDetectingView extends PureComponent<Props> {
  previouslyVisible = false;

  tickInterval: number | null | undefined;

  unmounted = false;

  view: ElementRef<typeof View> | null | undefined;

  onRef = (view?: ElementRef<typeof View> | null) => {
    this.view = view;
  };

  onTick = () => {
    if (this.unmounted) {
      return;
    }

    // UIManager.measure may not exist during render-testing, which might break the
    // `view.measure` call
    if (this.view && UIManager.measure) {
      this.view.measure(this.onMeasure);
    }
  };

  onMeasure = (
    x: number,
    y: number,
    width: number,
    height: number,
    pageX: number,
    pageY: number,
  ) => {
    // Grab metrics
    const windowDimensions = Dimensions.get('window');
    const bottom = pageY + height;
    const left = pageX;
    const right = pageX + width;
    const top = pageY;
    const windowHeight = windowDimensions.height;
    const windowWidth = windowDimensions.width;

    // Calculate visibility
    const visible =
      right > 0 && left < windowWidth && top < windowHeight && bottom > 0;

    // Either trigger onVisible or onInvisible
    if (!this.previouslyVisible && visible) {
      if (this.props.onVisible) {
        this.props.onVisible();
      }
    } else if (this.previouslyVisible && !visible) {
      if (this.props.onInvisible) {
        this.props.onInvisible();
      }
    }

    // Remember visibility
    this.previouslyVisible = visible;
  };

  start = () => {
    this.tickInterval = setInterval(this.onTick, TICK_INTERVAL);
  };

  stop = () => {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  };

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.unmounted = true;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.stop();
      this.previouslyVisible = false;
      this.start();
    }
  }

  render() {
    return (
      <View
        ref={this.onRef}
        // collapsable has to be false for view.measure to work on Android
        collapsable={false}
        style={this.props.style}
      >
        {this.props.children}
      </View>
    );
  }
}
