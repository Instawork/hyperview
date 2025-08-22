import { Animated, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { createProps, createStyleProp } from 'hyperview';
import type { HvComponentProps } from 'hyperview';

const namespace = 'https://hyperview.org/progress-bar';

const getNumberAttr = (
  attrName: string,
  element: Element,
  defaultValue: number,
): number => {
  const value: string | null = element.getAttributeNS(namespace, attrName);
  if (!value) {
    return defaultValue;
  }
  return parseFloat(value);
};

const ProgressBar = (props: HvComponentProps) => {
  const value = getNumberAttr('value', props.element, 0);
  const maxValue = getNumberAttr('max-value', props.element, 1);
  const duration = getNumberAttr('duration', props.element, 200);
  const [animatedValue] = useState(value);
  const barValue = useRef(new Animated.Value(value)).current;
  const barWidthStyle = {
    width: barValue.interpolate({
      inputRange: [0, maxValue],
      outputRange: ['0%', '100%'],
    }),
  };
  const containerProps = createProps(
    props.element,
    props.stylesheets,
    props.options,
  );
  const style = createStyleProp(props.element, props.stylesheets, {
    ...props.options,
    styleAttr: `${props.element.prefix}:bar-style`,
  });

  useEffect(() => {
    if (animatedValue !== value) {
      Animated.timing(barValue, {
        duration,
        toValue: value,
        useNativeDriver: false,
      }).start();
    }
  }, [animatedValue, barValue, duration, value]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <View {...containerProps}>
      <Animated.View style={[...style, barWidthStyle]} />
    </View>
  );
};

ProgressBar.namespaceURI = namespace;
ProgressBar.localName = 'progress-bar';

export { ProgressBar };
