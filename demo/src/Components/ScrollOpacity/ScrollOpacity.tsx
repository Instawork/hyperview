import type { HvComponentProps, LocalName } from 'hyperview';
import Hyperview, { useScrollContext } from 'hyperview';
import React, { useEffect, useRef } from 'react';
import { getNumberAttr, namespaceURI } from './utils';
import { Animated } from 'react-native';

const ScrollOpacity = (props: HvComponentProps) => {
  const contextKey = props.element.getAttributeNS(namespaceURI, 'context-key');
  const axis = props.element.getAttributeNS(namespaceURI, 'axis') || 'vertical';
  const distance = getNumberAttr(props.element, 'distance', 0);
  const duration = getNumberAttr(props.element, 'duration', 0);
  const initialOpacity = getNumberAttr(props.element, 'initial-opacity', 1);
  const opacity = useRef(new Animated.Value(initialOpacity)).current;
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
    const toValue = Math.min(
      Math.max(position / Math.max(distance, 2) - 1, 0),
      1,
    );
    Animated.timing(opacity, {
      duration,
      toValue,
      useNativeDriver: true,
    }).start();
  }, [axis, contextKey, distance, duration, opacity, position, x, y]);

  const children = (Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  ) as unknown) as JSX.Element;
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
};

ScrollOpacity.namespaceURI = namespaceURI;
ScrollOpacity.localName = 'scroll-opacity' as LocalName;
ScrollOpacity.localNameAliases = [] as LocalName[];

export { ScrollOpacity };
