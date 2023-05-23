/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Centralized capturing of the navigation library imports.
 */

/**
 * Additional dependencies:
 * yarn add react-native-tab-view@3.5.1
 * yarn add react-native-pager-view@6.2.0
 * yarn add react-native-gesture-handler@2.9.0
 * yarn add react-native-safe-area-context@4.2.4
 */
export type { NavigationProp, Route } from '@react-navigation/native';
export { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
export { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
export { createStackNavigator } from '@react-navigation/stack';
