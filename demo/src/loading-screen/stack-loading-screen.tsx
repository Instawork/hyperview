import { ActivityIndicator, Text, View } from 'react-native';
import React from 'react';

/**
 * Example loadingScreen used in stack navigation
 */
const StackLoadingScreen = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        gap: 10,
        justifyContent: 'center',
      }}
    >
      <Text>Loading a modal from navigation hierarchy ...</Text>
      <ActivityIndicator />
    </View>
  );
};

export default StackLoadingScreen;
