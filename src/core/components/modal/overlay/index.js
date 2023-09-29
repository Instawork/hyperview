// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Animated, TouchableWithoutFeedback } from 'react-native';
import type { Props } from './types';
import React from 'react';
import styles from './styles';

export default (props: Props) => (
  <TouchableWithoutFeedback onPress={props.onPress}>
    <Animated.View style={[styles.overlay, props.style]} />
  </TouchableWithoutFeedback>
);
