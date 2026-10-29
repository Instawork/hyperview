import * as CustomStackRouter from 'hyperview/src/components/navigator-stack/router';
import * as React from 'react';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackView,
} from '@react-navigation/native-stack';
import type { Props, StackOptions } from './types';
import {
  StackActionHelpers,
  StackNavigationState,
  useNavigationBuilder,
} from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/routers';
import { useHvDocContext } from 'hyperview/src/elements/hv-doc';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

export default function NativeStackNavigator(props: Props) {
  const { getSourceDoc } = useHvDocContext();
  const { entrypointUrl } = useHyperview();

  const {
    state,
    describe,
    descriptors,
    navigation,
    render,
  } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackOptions,
    StackActionHelpers<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap
  >(CustomStackRouter.Router, {
    children: props.children,
    entrypointUrl,
    getDoc: () => getSourceDoc(),
    id: props.id,
    initialRouteName: props.initialRouteName,
    screenOptions: props.screenOptions as NativeStackNavigationOptions,
  });

  return render(
    <NativeStackView
      describe={describe}
      descriptors={descriptors}
      navigation={navigation}
      state={state}
    />,
  );
}
