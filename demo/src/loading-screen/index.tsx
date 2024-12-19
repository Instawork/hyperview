import { ActivityIndicator, View } from 'react-native';
import type { Props } from './types';
import React from 'react';

const defaultColor = '#8d9494';

const getBehaviorColor = (showDuringLoad?: string | null): string => {
  if (!showDuringLoad) {
    return defaultColor;
  }
  if (showDuringLoad === 'green-loader') {
    return 'green';
  }
  if (showDuringLoad === 'red-loader') {
    return 'red';
  }
  return defaultColor;
};

const getRouteColor = (routeId?: string | null): string => {
  if (!routeId) {
    return defaultColor;
  }
  if (routeId === 'modal-w-blue-loader') {
    return 'blue';
  }
  return defaultColor;
};

/**
 * LoadingScreen passed into the Hyperview component as the loadingScreen prop.
 * This component will manage showing the correct loading screen based on `screenId`
 */
const LoadingScreen = (props: Props) => {
  const color =
    props.element?.nodeName === 'behavior'
      ? getBehaviorColor(props.element?.getAttribute('show-during-load'))
      : getRouteColor(props.element?.getAttribute('id'));
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

export default LoadingScreen;
