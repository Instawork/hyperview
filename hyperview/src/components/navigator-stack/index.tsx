import * as CustomStackRouter from 'hyperview/src/components/navigator-stack/router';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as React from 'react';
import type {
  CompatibleStackViewProps,
  NavigationBuilderWithDescribe,
  Props,
  StackOptions,
} from './types';
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
import type { ParamListBase } from '@react-navigation/routers';
import { useHvDocContext } from 'hyperview/src/elements/hv-doc';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

const CompatibleStackView = StackView as React.ComponentType<CompatibleStackViewProps>;

const CustomStackNavigator = (props: Props) => {
  const { getSourceDoc } = useHvDocContext();
  const { entrypointUrl } = useHyperview();
  const { direction } = NavigatorService.useCompatibleLocale();

  const builder = useNavigationBuilder<
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
  const { state, descriptors, navigation, NavigationContent } = builder;
  const { describe } = (builder as unknown) as NavigationBuilderWithDescribe;

  return (
    <NavigationContent>
      <CompatibleStackView
        describe={NavigatorService.isReactNavigation7 ? describe : undefined}
        descriptors={descriptors}
        direction={NavigatorService.isReactNavigation7 ? direction : undefined}
        navigation={navigation}
        state={state}
      />
    </NavigationContent>
  );
};

export default createNavigatorFactory(CustomStackNavigator);
