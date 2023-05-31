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

export type {
  NavigatorScreenParams,
  NavigationProp,
  Route,
} from '@react-navigation/native';
export type { NavigationState } from '@react-navigation/core';
export { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
export { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
export { createStackNavigator } from '@react-navigation/stack';
export { CommonActions, StackActions } from '@react-navigation/native';
