import { ActivityIndicator, Text, View } from 'react-native';
import React from 'react';

/**
 * Example loadingScreen used in stack navigation
 */
const BehaviorLoadingScreen = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        gap: 10,
        justifyContent: 'center',
      }}
    >
      <Text>Loading a modal from a behavior ...</Text>
      <ActivityIndicator />
    </View>
  );
};

export default BehaviorLoadingScreen;
