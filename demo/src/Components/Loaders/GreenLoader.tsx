import { ActivityIndicator, View } from 'react-native';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';
import React from 'react';

/**
 * Custom loading screen that displays a green ActivityIndicator.
 */
const GreenLoadingScreen = (props: LoadingProps) => {
  const color = props.color || '#63CB76';
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color={color} size="large" />
    </View>
  );
};

export default GreenLoadingScreen;
