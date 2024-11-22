import { ActivityIndicator, View } from 'react-native';
import type { Props as LoadingProps } from 'hyperview/src/core/components/loading';
import React from 'react';

/**
 * DefaultLoadingScreen passed into the Hyperview component as the loadingScreen prop.
 * This component will be used when a screen is loading and no other loading screen is specified.
 */
const DefaultLoadingScreen = (props: LoadingProps) => {
  const color = props.color || '#8d9494';
  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        gap: 10,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator color={color} size="large" />
    </View>
  );
};

export default DefaultLoadingScreen;
