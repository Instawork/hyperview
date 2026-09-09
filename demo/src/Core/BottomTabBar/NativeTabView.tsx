import * as React from 'react';
import type { NativeTabEvent, NativeTabViewProps } from './types';
import { CommonActions } from '@react-navigation/native';
import type { NativeSyntheticEvent } from 'react-native';
import { Tabs } from 'react-native-screens';

const NativeTabView = (props: NativeTabViewProps) => {
  const focusedRouteKey = props.state.routes[props.state.index].key;
  const [confirmedProvenance, setConfirmedProvenance] = React.useState(0);

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
      {props.items.map(item => {
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

export default NativeTabView;
