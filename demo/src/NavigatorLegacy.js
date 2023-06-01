/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Constants from './constants';
import HyperviewScreenLegacy from './HyperviewScreenLegacy';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen
            component={HyperviewScreenLegacy}
            initialParams={{ url: Constants.ENTRY_POINT_URL }}
            name={Constants.MAIN_STACK_NAME}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            component={HyperviewScreenLegacy}
            name={Constants.MODAL_STACK_NAME}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
