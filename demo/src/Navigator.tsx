/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Constants from './constants';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HyperviewScreen from './HyperviewScreen';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import type { RootStackParamList } from './types';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const insets = useSafeAreaInsets();
  return (
      <View
        style={{
          flex: 1,

          // Paddings to handle safe area
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingTop: insets.top,
        }}
      >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
              <Stack.Screen
                component={HyperviewScreen}
                initialParams={{ url: Constants.ENTRY_POINT_URL }}
                name={Constants.MAIN_STACK_NAME}
              />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen
                component={HyperviewScreen}
                name={Constants.MODAL_STACK_NAME}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
  );
};

export default () => {
  return (
    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
};
