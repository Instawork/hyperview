import { Animated, TouchableWithoutFeedback } from 'react-native';
import type { OverlayProps } from './types';
import React from 'react';
import styles from './styles';

export default (props: OverlayProps) => (
  <TouchableWithoutFeedback onPress={props.onPress}>
    <Animated.View style={[styles.overlay, props.style]} />
  </TouchableWithoutFeedback>
);
