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
import Hyperview from 'hyperview';
import { fetchWrapper, formatDate } from './helpers';
import { ToggleSwitch } from './ToggleSwitch';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Use a toggle to switch between internal and external navigators.
 */
const ToggleView = () => {
  const [useInternalNavigator, setUseInternalNavigator] = React.useState(false);
  const toggleValue = () =>
    setUseInternalNavigator(previousState => !previousState);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
          paddingTop: insets.top,
          paddingBottom: 12,
        }}
      >
        <ToggleSwitch
          isEnabled={useInternalNavigator}
          toggleValue={toggleValue}
        />
      </View>
      <View
        style={{
          flex: 1,

          // Padding to handle safe area
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <NavigationContainer>
          {useInternalNavigator ? <InternalNavigator /> : <ExternalNavigator />}
        </NavigationContainer>
      </View>
    </View>
  );
};

/**
 * Provide an external navigator to Hyperview
 */
const ExternalNavigator = () => {
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

/**
 * Hyperview will create an internal Navigator from the document HXML
 */
const InternalNavigator = () => {
  return (
    <Hyperview
      entrypointUrl={Constants.ENTRY_POINT_NAV_URL}
      fetch={fetchWrapper}
      formatDate={formatDate}
    />
  );
};

export default () => {
  return (
    <SafeAreaProvider>
      <ToggleView />
    </SafeAreaProvider>
  );
};
