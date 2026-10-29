import * as React from 'react';
import type { BottomTabViewProps, NativeTabEvent } from './types';
import { getNativeTabItems, isLiquidGlassSupported } from './helpers';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import type { NativeSyntheticEvent } from 'react-native';
import { BottomTabView as RNBottomTabView } from '@react-navigation/bottom-tabs';
import { TabBar } from './TabBar';
import { Tabs } from 'react-native-screens';
import { useBottomTabBarContext } from '../../Contexts';

export const BottomTabView = (props: BottomTabViewProps) => {
  const { getElementProps } = useBottomTabBarContext();
  const [confirmedProvenance, setConfirmedProvenance] = React.useState(0);
  const mountedRouteKeys = React.useRef(new Set<string>());
  const navigatorId = props.navigation.getId?.();

  if (!isLiquidGlassSupported()) {
    const tabBar = (tabBarProps: BottomTabBarProps) => {
      if (!navigatorId) {
        return null;
      }
      return (
        <TabBar
          descriptors={tabBarProps.descriptors}
          id={navigatorId}
          insets={tabBarProps.insets}
          navigation={tabBarProps.navigation}
          state={tabBarProps.state}
        />
      );
    };

    return (
      <RNBottomTabView
        descriptors={props.descriptors}
        navigation={props.navigation}
        state={props.state}
        tabBar={tabBar}
      />
    );
  }

  const focusedRouteKey = props.state.routes[props.state.index].key;
  mountedRouteKeys.current.add(focusedRouteKey);
  const nativeTabItems = navigatorId
    ? getNativeTabItems(getElementProps?.(navigatorId)) ?? []
    : [];
  const nativeTabRoutes = new Set(nativeTabItems.map(({ route }) => route));
  const tabBarHidden = props.state.routes.some(
    ({ name }) => !nativeTabRoutes.has(name),
  );
  const onTabSelectionChange = (
    event: NativeSyntheticEvent<NativeTabEvent>,
  ) => {
    const { actionOrigin, provenance, selectedScreenKey } = event.nativeEvent;
    const route = props.state.routes.find(
      item => item.key === selectedScreenKey,
    );

    if (!route) {
      return;
    }

    const tabPressEvent =
      actionOrigin === 'user'
        ? props.navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'tabPress',
          })
        : undefined;

    setConfirmedProvenance(provenance);
    if (
      tabPressEvent?.defaultPrevented ||
      actionOrigin === 'programmatic-js' ||
      focusedRouteKey === route.key
    ) {
      return;
    }

    props.navigation.dispatch({
      ...CommonActions.navigate({ merge: true, name: route.name }),
      target: props.state.key,
    });
  };

  return (
    <Tabs.Host
      ios={{ tabBarMinimizeBehavior: 'onScrollDown' }}
      navStateRequest={{
        baseProvenance: confirmedProvenance,
        selectedScreenKey: focusedRouteKey,
      }}
      onTabSelected={onTabSelectionChange}
      onTabSelectionRejected={onTabSelectionChange}
      rejectStaleNavStateUpdates
      tabBarHidden={tabBarHidden}
    >
      {props.state.routes.map(route => {
        const item = nativeTabItems.find(tab => tab.route === route.name);
        return (
          <Tabs.Screen
            key={route.key}
            badgeValue={item?.badgeValue}
            ios={{ icon: item?.icon }}
            screenKey={route.key}
            title={item?.label ?? route.name}
          >
            {mountedRouteKeys.current.has(route.key)
              ? props.descriptors[route.key].render()
              : null}
          </Tabs.Screen>
        );
      })}
    </Tabs.Host>
  );
};
