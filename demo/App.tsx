/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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

const NAMESPACE_URI = 'https://instawork.com/hyperview-set-navigator-source';

/**
 * Define expected values
 */
enum NavigationSource {
  HXML = 'hxml',
  EXTERNAL = 'external',
}

export default () => {
  const [useHXML, setUseXML] = useState<boolean>(false);

  /**
   * Create a custom behavior to toggle using HXML to define the navigator hierarchy
   */
  const setNavigatorSrcBehavior = {
    action: 'set-navigator-source',
    callback: (element: Element) => {
      const source = element.getAttributeNS(NAMESPACE_URI, 'source');
      if (source === NavigationSource.HXML) {
        setUseXML(true);
      } else if (source === NavigationSource.EXTERNAL) {
        setUseXML(false);
      }
    },
  };

  // Pass the behavior to the HyperviewScreen
  HyperviewScreen.Behaviors = [setNavigatorSrcBehavior];

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
              {useHXML ? (
                // Hyperview will build a Navigator structure from the HXML document
                <Hyperview
                  behaviors={[setNavigatorSrcBehavior]}
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
