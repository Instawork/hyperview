import * as React from 'react';
import {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabView,
} from '@react-navigation/bottom-tabs';
import {
  EventMapBase,
  TabActionHelpers,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/native';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import type { Props } from './types';

const CustomTabNavigator = (props: Props) => {
  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<ParamListBase>,
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
    const curState = navigation.getState();
    const foundIndex = curState.routes.findIndex(
      route => route.name === props.initialRouteName,
    );
    if (foundIndex > -1) {
      navigation.reset({ ...curState, index: foundIndex });
    }
  }, [props.initialRouteName, navigation]);

  return (
    <NavigationContent>
      <BottomTabView
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        descriptors={descriptors}
        navigation={navigation}
        state={state}
      />
    </NavigationContent>
  );
};

export const createCustomTabNavigator = createNavigatorFactory<
  Readonly<NavigationState>,
  object,
  EventMapBase,
  typeof CustomTabNavigator
>(CustomTabNavigator);
