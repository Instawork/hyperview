import { Dimensions, UIManager, View } from 'react-native';
import React, { PureComponent } from 'react';

const TICK_INTERVAL = 100;

/** A view that lets you know when its contents become visible/invisible in the screen.
 *  Useful for progressively loading content in a scroll view.
 *  Uses a timer internally to periodically check whether or not it is visible/invisible
*/
export default class VisibilityDetectingView extends PureComponent {
  previouslyVisible = false;
  tickInterval: ?number;
  unmounted = false;
  view: ?View;

  onRef = (view: View) => {
    this.view = view;
  }

  onTick = () => {
    if (this.unmounted) {
      return;
    }

    // UIManager.measure may not exist during render-testing, which might break the
    // `view.measure` call
    if (this.view && UIManager.measure) {
      this.view.measure(this.onMeasure);
    }
  }

  onMeasure =
    (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      // Grab metrics
      const windowDimensions = Dimensions.get('window');
      const bottom = pageY + height;
      const left = pageX;
      const right = pageX + width;
      const top = pageY;
      const windowHeight = windowDimensions.height;
      const windowWidth = windowDimensions.width;

      // Calculate visibility
      const visible = (right > 0) && (left < windowWidth) && (top < windowHeight) && bottom > 0;

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
    }

  componentDidMount() {
    this.tickInterval = setInterval(this.onTick, TICK_INTERVAL);
  }

  componentWillUnmount() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    this.unmounted = true;
  }

  render() {
    return (
      <View
        // collapsable has to be false for view.measure to work on Android
        collapsable={false}
        ref={this.onRef}
        style={this.props.style}
      >
        {this.props.children}
      </View>
    );
  }
}
