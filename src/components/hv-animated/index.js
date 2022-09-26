// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from 'hyperview/src/contexts';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import React, { PureComponent, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import type { CompositeAnimation } from 'react-native/Libraries/Animated/src/AnimatedImplementation';
import { LOCAL_NAME } from 'hyperview/src/types';

type AnimationFunction = (*, *, *) => CompositeAnimation;

export default class HvAnimated extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.ANIMATED;

  static localNameAliases = [];

  props: HvComponentProps;

  getAnimationElements = (element: Element): Element[] => {
    // $FlowFixMe - elements are filtered to guarantee the return type
    return Array.from(element.childNodes).filter(
      n => n?.tagName === LOCAL_NAME.ANIMATION,
    );
  };

  convertAnimationElement = (
    element: Element,
    values: any,
  ): AnimationFunction => {
    const animations = element?.childNodes?.length
      ? this.getAnimationElements(element).map(el =>
          this.convertAnimationElement(el),
        )
      : [];
    const type = element.getAttribute('type');
    const value = element.getAttribute('value');
    if (['sequence', 'parallel'].includes(type)) {
      return Animated[type](animations);
    }
    const duration = element.getAttribute('duration');
    if (type === 'delay') {
      return Animated[type](duration);
    }
    if (type === 'timing') {
      return Animated[type](duration);
    }
  };

  render() {
    Animated.sequence();
    const animationRunner = () => {
      const valueElements = this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.VALUE,
      );
      const animatedValues = valueElements.map(el =>
        useRef(parseInt(new Animated.Value(el.getAttribute('from')), 10)),
      );
      const animations = this.getAnimationElements(this.props.element);
      animations.map(animation => {
        const type = animation.getAttribute('type');
        if (type === 'sequence') {
        }
        Animated[animation.getAttribute(type)];
      });
      useEffect(() => {});
    };
    return (
      <Contexts.AnimatedContext.Consumer>
        {animationSetter => animationSetter(animationRunner)}
      </Contexts.AnimatedContext.Consumer>
    );
  }
}
