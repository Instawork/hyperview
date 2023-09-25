/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import * as Types from './types';
import {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabView,
} from '@react-navigation/bottom-tabs';
import {
  TabActionHelpers,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/native';

const CustomTabNavigator = (
  props: Types.Props,
  ...restWithDeprecated: undefined[]
) => {
  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    TabNavigationState<Types.ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<Types.ParamListBase>,
    BottomTabNavigationOptions,
    BottomTabNavigationEventMap
  >(TabRouter, {
    backBehavior: props.backBehavior,
    children: props.children,
    id: props.id,
    initialRouteName: props.initialRouteName,
    screenOptions: props.screenOptions,
  });

  React.useEffect(() => {
    navigation.navigate(props.initialRouteName);
  }, [props.initialRouteName, navigation]);

  return (
    <NavigationContent>
      <BottomTabView
        descriptors={descriptors}
        navigation={navigation}
        state={state}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restWithDeprecated}
      />
    </NavigationContent>
  );
};

// export default createNavigatorFactory(CustomTabNavigator);

export const createCustomTabNavigator = createNavigatorFactory<
  Readonly<Types.NavigationState>,
  object,
  Types.EventMapBase,
  typeof CustomTabNavigator
>(CustomTabNavigator);
