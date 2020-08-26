// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import { createProps } from 'hyperview/src/services';
import type { HvComponentProps } from 'hyperview/src/types';
import { Animated, View } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';

export default class HvImage extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.PROGRESS_BAR;
  static localNameAliases = [];
  props: HvComponentProps;

  constructor(props) {
    super(props);
    const element = this.props.element;
    const startPercent: ?number = this.getStartPercent(element);
    const initialPercent: number =
      startPercent === null ? this.getPercent(element) || 0 : startPercent;
    this.state = {
      barPercent: new Animated.Value(initialPercent),
    };
  }

  getStartPercent = (element): ?number => {
    const startPercent: ?DOMString = element.getAttribute('start-percent');
    if (startPercent === null || startPercent === '') {
      return null;
    }
    return parseFloat(startPercent);
  };

  getPercent = (element): ?number => {
    const percent: ?DOMString = element.getAttribute('percent');
    if (percent === null || percent === '') {
      return null;
    }
    return parseFloat(percent);
  };

  getMaxDuration = (element): ?number => {
    const duration: ?DOMString = element.getAttribute('max-duration');
    if (duration === null || duration === '') {
      return 2000;
    }
    return parseInt(duration, 10);
  };

  componentDidMount() {
    const element = this.props.element;
    const startPercent: ?number = this.getStartPercent(element);
    const percent: ?number = this.getPercent(element);
    const maxDuration: number = this.getMaxDuration(element);
    const duration: numer =
      (Math.abs(startPercent - percent) / 100) * maxDuration;

    if (startPercent !== null && percent !== null) {
      Animated.timing(this.state.barPercent, {
        toValue: percent,
        duration,
      }).start();
    }
  }

  componentDidUpdate(prevProps) {
    const prevElement = prevProps.element;
    const prevPercent = this.getPercent(prevElement);

    const element = this.props.element;
    const percent = this.getPercent(element);
    const maxDuration: number = this.getMaxDuration(element);
    const duration: numer =
      (Math.abs(prevPercent - percent) / 100) * maxDuration;

    if (prevPercent !== percent) {
      Animated.timing(this.state.barPercent, {
        toValue: percent,
        duration,
      }).start();
    }
  }

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;

    const barWidthStyle = {
      width: this.state.barPercent.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      }),
    };
    const props = createProps(element, stylesheets, options);
    const barProps = createProps(element, stylesheets, {
      ...options,
      styleAttr: 'bar-style',
    });
    barProps.style = [...barProps.style, barWidthStyle];

    const component = (
      <View {...props}>
        <Animated.View {...barProps} />
      </View>
    );
    return component;
  }
}
