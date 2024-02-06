/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navigator from './Navigator';
import NavigatorHXML from './NavigatorHXML';
import {
  NavigatorContext,
  NavigatorContextProvider,
} from './NavigatorContextProvider';

/**
 * Toggle between two different versions of Hyperview Navigator setup. You can choose
 *    which approach you would prefer to use.
 *  1. Passing an externally provided Navigator hierarchy (Navigator)
 *  2. Using an internal Navigator from an endpoint which defines an HXML Navigator hierarchy (NavigatorHXML)
 */
export const NavigatorSelector = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,

        // Padding to handle safe area
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <NavigatorContext.Consumer>
        {value => (
          <NavigationContainer>
            {value?.useHXMLNavigator ? <NavigatorHXML /> : <Navigator />}
          </NavigationContainer>
        )}
      </NavigatorContext.Consumer>
    </View>
  );
};

export default () => {
  return (
    <SafeAreaProvider>
      <NavigatorContextProvider>
        <NavigatorSelector />
      </NavigatorContextProvider>
    </SafeAreaProvider>
  );
};
