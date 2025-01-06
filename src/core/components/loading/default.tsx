import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import styles from './styles';

/**
 * Internal default loading screen
 */
const DefaultLoading = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};

export default DefaultLoading;
