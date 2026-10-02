import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import type { ElementErrorComponentProps } from 'hyperview/src/types';
import React from 'react';
import styles from './styles';

const LoadElementError = (props: ElementErrorComponentProps) => {
  const getError = () => {
    if (__DEV__) {
      return `${props.error.name}: ${props.error.message}`;
    }
    if (
      props.error.name === 'TypeError' &&
      props.error.message === 'Network request failed'
    ) {
      return 'You seem to be offline, check your connection';
    }
    return 'An error occurred';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{getError()}</Text>
        </View>
        <TouchableOpacity onPress={props.onPressReload}>
          <View style={styles.btnWrapper}>
            <Text style={styles.button}>Reload</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>or</Text>
        </View>
        <TouchableOpacity onPress={props.onPressClose}>
          <View style={styles.btnWrapper}>
            <Text style={styles.button}>Hide</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoadElementError;
