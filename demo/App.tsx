import * as Constants from './src/constants';
import Hyperview from 'hyperview';
import './src/gesture-handler';
import React, { useState } from 'react';
import { fetchWrapper, formatDate } from './src/helpers';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import HyperviewScreen from './src/HyperviewScreen';
import { View } from 'react-native';
import Navigator from './src/Navigator';
import { NavigationContainer } from '@react-navigation/native';

const NAMESPACE_URI = 'https://hyperview.org/demo';

enum NavigatorSource {
  EXTERNAL = 'external',
  HYPERVIEW = 'hyperview',
}

export default () => {
  const [navigatorSource, setNavigatorSource] = useState<NavigatorSource>(
    NavigatorSource.EXTERNAL,
  );

  /**
   * Create a custom behavior to toggle using HXML to define the navigator hierarchy
   */
  const setNavigatorSourceBehavior = {
    action: 'set-navigator-source',
    callback: (element: Element) => {
      const source = element.getAttributeNS(NAMESPACE_URI, 'source');
      setNavigatorSource(source as NavigatorSource);
    },
  };

  // Pass the behavior to the HyperviewScreen
  HyperviewScreen.Behaviors = [setNavigatorSourceBehavior];

  return (
    <SafeAreaProvider>
      <SafeAreaInsetsContext.Consumer>
        {insets => (
          <View
            style={{
              flex: 1,

              // Padding to handle safe area
              paddingBottom: insets?.bottom,
              paddingLeft: insets?.left,
              paddingRight: insets?.right,
            }}
          >
            <NavigationContainer>
              {navigatorSource == NavigatorSource.HYPERVIEW ? (
                // Hyperview will build a Navigator structure from the HXML document
                <Hyperview
                  behaviors={[setNavigatorSourceBehavior]}
                  entrypointUrl={Constants.ENTRY_POINT_NAV_URL}
                  fetch={fetchWrapper}
                  formatDate={formatDate}
                />
              ) : (
                // Hyperview will rely on an external Navigator
                <Navigator />
              )}
            </NavigationContainer>
          </View>
        )}
      </SafeAreaInsetsContext.Consumer>
    </SafeAreaProvider>
  );
};
