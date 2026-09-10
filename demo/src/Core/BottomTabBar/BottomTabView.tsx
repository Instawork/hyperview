import * as React from 'react';
import type { BottomTabViewProps, NativeTabEvent } from './types';
import { getNativeTabItems, isLiquidGlassSupported } from './helpers';
import { BottomTabBar } from '.';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import type { NativeSyntheticEvent } from 'react-native';
import { BottomTabView as RNBottomTabView } from '@react-navigation/bottom-tabs';
import { Tabs } from 'react-native-screens';
import { useBottomTabBarContext } from '../../Contexts';

export const BottomTabView = (props: BottomTabViewProps) => {
  const { getElementProps } = useBottomTabBarContext();
  const [confirmedProvenance, setConfirmedProvenance] = React.useState(0);
  const navigatorId = props.navigation.getId?.();
  const nativeTabItems =
    isLiquidGlassSupported() && navigatorId
      ? getNativeTabItems(getElementProps?.(navigatorId))
      : false;

  if (!nativeTabItems) {
    const tabBar = (tabBarProps: BottomTabBarProps) => {
      if (nativeTabItems === undefined || !navigatorId) {
        return null;
      }
      return (
        <BottomTabBar
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
    >
      {nativeTabItems.map(item => {
        const route = props.state.routes.find(
          ({ name }) => name === item.route,
        );
        if (!route) {
          return null;
        }

        return (
          <Tabs.Screen
            key={route.key}
            badgeValue={item.badgeValue}
            ios={{ icon: item.icon }}
            screenKey={route.key}
            title={item.label ?? route.name}
          >
            {props.descriptors[route.key].render()}
          </Tabs.Screen>
        );
      })}
    </Tabs.Host>
  );
};
