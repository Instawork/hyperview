import * as CustomStackRouter from 'hyperview/src/core/components/navigator-stack/router';
import * as React from 'react';
import type { NavigationState, ParamListBase } from '@react-navigation/routers';
import type { Props, StackOptions } from './types';
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
import type { EventMapBase } from '@react-navigation/native';
import { useDependencyContext } from 'hyperview/src/core/components/dependencies';
import { useDocStateContext } from 'hyperview/src/elements/hv-doc';

const CustomStackNavigator = (props: Props) => {
  const docState = useDocStateContext();
  const dependencies = useDependencyContext();

  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
  >(CustomStackRouter.Router, {
    children: props.children,
    dependencies,
    getDoc: docState?.getSourceDoc,
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
  Readonly<NavigationState>,
  StackNavigationOptions,
  EventMapBase,
  typeof CustomStackNavigator
>(CustomStackNavigator);
