import React, { useEffect, useRef } from 'react';
import {
  calculateOpacity,
  getNumberAttr,
  getRangeAttr,
  namespaceURI,
} from './utils';
import { createStyleProp, renderChildren, useScrollContext } from 'hyperview';
import { Animated } from 'react-native';
import type { HvComponentProps } from 'hyperview';

const ScrollOpacity = (props: HvComponentProps) => {
  const contextKey = props.element.getAttributeNS(namespaceURI, 'context-key');
  const axis = props.element.getAttributeNS(namespaceURI, 'axis') || 'vertical';
  const scrollRange = getRangeAttr(props.element, 'scroll-range', [0, 100]);
  const opacityRange = getRangeAttr(props.element, 'opacity-range', [0, 1]);
  const duration = getNumberAttr(props.element, 'duration', 0);
  const style = createStyleProp(props.element, props.stylesheets, {
    ...props.options,
    styleAttr: 'style',
  });
  const opacity = useRef(
    // Assumes the default scroll position is 0
    new Animated.Value(calculateOpacity(0, scrollRange, opacityRange)),
  ).current;
  const { offsets } = useScrollContext();

  const defaultPosition = { x: 0, y: 0 };
  const { x, y } = (() => {
    if (!contextKey) {
      return defaultPosition;
    }
    if (!offsets[contextKey]) {
      return defaultPosition;
    }
    return offsets[contextKey];
  })();
  const position = (() => {
    if (axis === 'horizontal') {
      return x;
    }
    if (axis === 'vertical') {
      return y;
    }
    throw new Error(`Invalid axis: ${axis}`);
  })();

  useEffect(() => {
    const toValue = calculateOpacity(position, scrollRange, opacityRange);
    Animated.timing(opacity, {
      duration,
      toValue,
      useNativeDriver: true,
    }).start();
  }, [duration, opacity, opacityRange, position, scrollRange]);

  const children = (renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  ) as unknown) as JSX.Element;
  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
};

ScrollOpacity.namespaceURI = namespaceURI;
ScrollOpacity.localName = 'scroll-opacity';

export { ScrollOpacity };
