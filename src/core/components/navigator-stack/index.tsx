/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as CustomStackRouter from 'hyperview/src/core/components/navigator-stack/router';
import * as React from 'react';
import * as Types from './types';

import {
  StackActionHelpers,
  StackNavigationState,
  createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/native';
import {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackView,
} from '@react-navigation/stack';

const CustomStackNavigator = (props: Types.Props) => {
  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    StackNavigationState<Types.ParamListBase>,
    Types.StackOptions,
    StackActionHelpers<Types.ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
  >(CustomStackRouter.Router, {
    children: props.children,
    id: props.id,
    initialRouteName: props.initialRouteName,
    screenOptions: props.screenOptions,
  });

  return (
    <NavigationContent>
      <StackView
        descriptors={descriptors}
        navigation={navigation}
        state={state}
      />
    </NavigationContent>
  );
};

export const createCustomStackNavigator = createNavigatorFactory<
  Readonly<Types.NavigationState>,
  StackNavigationOptions,
  Types.EventMapBase,
  typeof CustomStackNavigator
>(CustomStackNavigator);
