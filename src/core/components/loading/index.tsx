import { ActivityIndicator, View } from 'react-native';
import React, { PureComponent } from 'react';
import type { Props } from './types';
import styles from './styles';

export default class Loading extends PureComponent<Props> {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

export * from './types';
