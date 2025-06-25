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
import { useHvDocContext } from 'hyperview/src/elements/hv-doc';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

const CustomStackNavigator = (props: Props) => {
  const { getSourceDoc } = useHvDocContext();
  const { entrypointUrl } = useHyperview();

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
    entrypointUrl,
    getDoc: () => getSourceDoc(),
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
