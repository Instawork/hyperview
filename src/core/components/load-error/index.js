// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Props } from './types';
import styles from './styles';

export default class LoadError extends PureComponent<Props> {
  props: Props;

  Title = () => <Text>An error occured</Text>;

  ReloadButton = () => (
    <TouchableOpacity onPress={this.props.onPressReload}>
      <Text style={styles.button}>Reload</Text>
    </TouchableOpacity>
  );

  render() {
    const { ReloadButton, Title } = this;
    return (
      <View style={styles.container}>
        <Title />
        <ReloadButton />
      </View>
    );
  }
}
