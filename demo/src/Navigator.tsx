/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Constants from './constants';
import HyperviewScreen from './HyperviewScreen';
import React from 'react';
import type { RootStackParamList } from './types';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Provide an external navigator to Hyperview
 */
export default () => {
  return (
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
  );
};
