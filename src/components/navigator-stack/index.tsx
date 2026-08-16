import * as CustomStackRouter from 'hyperview/src/components/navigator-stack/router';
import * as React from 'react';
import type { Props, StackOptions } from './types';
import {
  StackActionHelpers,
  StackNavigationState,
  createNavigatorFactory,
  useLocale,
  useNavigationBuilder,
} from '@react-navigation/native';
import {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackView,
} from '@react-navigation/stack';
import type { ParamListBase } from '@react-navigation/routers';
import { useHvDocContext } from 'hyperview/src/elements/hv-doc';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

const CustomStackNavigator = (props: Props) => {
  const { getSourceDoc } = useHvDocContext();
  const { entrypointUrl } = useHyperview();
  const { direction } = useLocale();

  const {
    state,
    describe,
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
        describe={describe}
        descriptors={descriptors}
        direction={direction}
        navigation={navigation}
        state={state}
      />
    </NavigationContent>
  );
};

export default createNavigatorFactory(CustomStackNavigator);
