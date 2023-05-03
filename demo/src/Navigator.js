/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import HyperviewScreen from './HyperviewScreen';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ENTRY_POINT_URL, MAIN_STACK_NAME, MODAL_STACK_NAME } from './constants';
import HyperviewNavScreen from './HyperviewNavScreen';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen
            component={HyperviewScreen}
            initialParams={{ url: ENTRY_POINT_URL }}
            name={MAIN_STACK_NAME}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            component={HyperviewScreen}
            name={MODAL_STACK_NAME}
          />
        </Stack.Group>
      </Stack.Navigator> */}

      <HyperviewNavScreen url={ENTRY_POINT_URL} />
    </NavigationContainer>
  );
}
