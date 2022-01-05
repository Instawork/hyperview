// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ActivityIndicator, View } from 'react-native';
import React, { PureComponent } from 'react';
import type { Props } from './types';
import styles from './styles';

export default class Loading extends PureComponent<Props> {
  props: Props;

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}
