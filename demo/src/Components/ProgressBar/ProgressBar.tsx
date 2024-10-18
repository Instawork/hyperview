import { Animated, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import type { HvComponentProps } from 'hyperview';
import Hyperview from 'hyperview';
import type { HvProps } from './types';

const ProgressBar = (props: HvComponentProps) => {
  const rawProps = Hyperview.createProps(
    props.element,
    props.stylesheets,
    props.options,
  );
  const hvProps: HvProps = {
    animationUnitsPerMs: parseFloat(
      rawProps['animation-units-per-ms'] ?? 0.0005,
    ),
    maxValue: parseFloat(rawProps['max-value'] ?? 1),
    value: parseFloat(rawProps.value ?? 0),
  };

  const value = useMemo(() => new Animated.Value(hvProps.value), [
    hvProps.value,
  ]);

  useEffect(() => {
    Animated.timing(value, {
      duration: 10,
      toValue: value,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const inputRange: [number, number] = [0, hvProps.maxValue];
  const outputRange: [string, string] = ['0%', '100%'];
  const barWidthStyle = {
    width: value.interpolate({
      inputRange,
      outputRange,
    }),
  };
  const style = Hyperview.createStyleProp(props.element, props.stylesheets, {
    ...props.options,
    styleAttr: 'bar-style',
  });

  return (
    <View>
      <Animated.View style={[...style, barWidthStyle]} />
    </View>
  );
};

ProgressBar.namespaceURI = 'https://hyperview.org/progress-bar';

ProgressBar.localName = 'progress-bar';

export { ProgressBar };
