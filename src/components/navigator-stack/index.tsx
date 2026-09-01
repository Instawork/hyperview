import * as CustomStackRouter from 'hyperview/src/components/navigator-stack/router';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as React from 'react';
import type {
  NativeViewComponent,
  NavigationBuilderWithDescribe,
  NavigationEventMap,
  NavigationOptions,
  Props,
  StackOptions,
  StackViewComponent,
} from './types';
import {
  StackActionHelpers,
  StackNavigationState,
  createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/native';
import { NativeStackView } from '@react-navigation/native-stack';
import type { ParamListBase } from '@react-navigation/routers';
import { StackView } from '@react-navigation/stack';
import { useHvDocContext } from 'hyperview/src/elements/hv-doc';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

const CompatibleNativeStackView = NativeStackView as NativeViewComponent;
const CompatibleStackView = StackView as StackViewComponent;

const Navigator = (props: Props) => {
  const { getSourceDoc } = useHvDocContext();
  const { enableNativeRoutes, entrypointUrl } = useHyperview();
  const { direction } = NavigatorService.useCompatibleLocale();
  const builder = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackOptions,
    StackActionHelpers<ParamListBase>,
    NavigationOptions,
    NavigationEventMap
  >(CustomStackRouter.Router, {
    children: props.children,
    entrypointUrl,
    getDoc: () => getSourceDoc(),
    id: props.id,
    initialRouteName: props.initialRouteName,
    screenOptions: props.screenOptions as NavigationOptions,
  });
  const { state, descriptors, navigation, NavigationContent } = builder;
  const { describe } = (builder as unknown) as NavigationBuilderWithDescribe;

  const stackView = enableNativeRoutes ? (
    <CompatibleNativeStackView
      describe={NavigatorService.isReactNavigation7 ? describe : undefined}
      descriptors={descriptors}
      navigation={navigation}
      state={state}
    />
  ) : (
    <CompatibleStackView
      describe={NavigatorService.isReactNavigation7 ? describe : undefined}
      descriptors={descriptors}
      direction={NavigatorService.isReactNavigation7 ? direction : undefined}
      navigation={navigation}
      state={state}
    />
  );

  return <NavigationContent>{stackView}</NavigationContent>;
};

export default createNavigatorFactory(Navigator);
