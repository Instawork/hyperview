import * as Contexts from 'hyperview/src/contexts';
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
import { Context as NavigationContext } from 'hyperview/src/contexts/navigation';

const CustomStackNavigator = (props: Props) => {
  const docContextProps = React.useContext(Contexts.DocContext);
  const navContextProps = React.useContext(NavigationContext);

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
    docContextProps,
    id: props.id,
    initialRouteName: props.initialRouteName,
    navContextProps,
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
