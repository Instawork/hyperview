import { ActivityIndicator, View } from 'react-native';
import BehaviorLoadingScreen from './behavior-loading-screen';
import type { Props } from './types';
import React from 'react';
import StackLoadingScreen from './stack-loading-screen';
import { useNativeTabHost } from '../Contexts';

/**
 * Example loadingScreen passed into Hyperview in App.tsx
 * This component shows how to use the `element` prop to determine affect the loading screen
 */
const LoadingScreen = (props: Props) => {
  const inNativeTabHost = useNativeTabHost();
  const href = props.element?.getAttribute('href');

  // Show a specific loading screen for this href
  if (href === '/hyperview/public/ui/ui-elements/loading-screen/modal.xml') {
    return <BehaviorLoadingScreen />;
  }

  // Show a specific loading screen for this href
  if (href === '/hyperview/public/navigation/navigator/stack/modal-1.xml') {
    return <StackLoadingScreen />;
  }
  if (inNativeTabHost) {
    return null;
  }
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        gap: 10,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator />
    </View>
  );
};

export default LoadingScreen;
