import { Animated, TouchableWithoutFeedback } from 'react-native';
import type { Props } from './types';
import React from 'react';
import styles from './styles';

export default (props: Props) => (
  <TouchableWithoutFeedback onPress={props.onPress}>
    <Animated.View style={[styles.overlay, props.style]} />
  </TouchableWithoutFeedback>
);
