import * as CustomTabRouter from 'hyperview/src/components/navigator-tab/router';
import * as React from 'react';
import {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
  BottomTabView,
} from '@react-navigation/bottom-tabs';
import {
  TabActionHelpers,
  TabNavigationState,
  createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/routers';
import type { Props } from './types';
import { useHvDocContext } from 'hyperview/src/elements/hv-doc';

const CustomTabNavigator = (props: Props) => {
  const { getSourceDoc } = useHvDocContext();
  const {
    state,
    descriptors,
    navigation,
    NavigationContent,
  } = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    CustomTabRouter.Options,
    TabActionHelpers<ParamListBase>,
    BottomTabNavigationOptions,
    BottomTabNavigationEventMap
  >(CustomTabRouter.Router, {
    backBehavior: props.backBehavior,
    children: props.children,
    getDoc: () => getSourceDoc(),
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

export default createNavigatorFactory(CustomTabNavigator);
