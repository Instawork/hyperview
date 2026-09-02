import type {
  NativeTabAction,
  NativeTabConfirmedState,
  NativeTabState,
  TabViewProps,
} from './types';
import {
  NativeTabHostContext,
  TabBarAppearance,
  TabBarMinimize,
  useBottomTabBarContext,
} from '../../Contexts';
import React, { useReducer } from 'react';
import type {
  TabSelectedEvent,
  TabSelectionPreventedEvent,
  TabSelectionRejectedEvent,
} from 'react-native-screens';
import { nativeTabBarItemsByRoute, nativeTabIcon } from './helpers';
import { BottomTabView } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import type { NativeSyntheticEvent } from 'react-native';
import { Tabs } from 'react-native-screens';

function reduceNativeTabState(
  state: NativeTabState,
  action: NativeTabAction,
): NativeTabState {
  if (
    state.confirmed.routeKey === action.confirmed.routeKey &&
    state.confirmed.provenance === action.confirmed.provenance
  ) {
    return state;
  }
  return { confirmed: action.confirmed };
}

/**
 * react-native-screens Tabs.Host. Native UITabBarController owns glass,
 * selection, and minimize-on-scroll. Labels and icons come from HXML once
 * the screen document registers <navigation:bottom-tab-bar>.
 */
export const NativeScreensTabView = (props: TabViewProps): JSX.Element => {
  const navigatorId = props.navigation.getId?.() ?? '';
  const { getElementProps, minimizeBehavior } = useBottomTabBarContext();
  const tabBarProps = getElementProps?.(navigatorId);
  const hvElement = tabBarProps?.element;
  const documentUrl =
    typeof tabBarProps?.options.screenUrl === 'string'
      ? tabBarProps.options.screenUrl
      : '';
  const itemsByRoute = nativeTabBarItemsByRoute(hvElement, documentUrl);
  const focusedRouteKey = props.state.routes[props.state.index].key;
  const [nativeState, dispatch] = useReducer(reduceNativeTabState, {
    confirmed: { provenance: 0, routeKey: focusedRouteKey },
  });

  const navigate = (
    route: typeof props.state.routes[number],
    confirmed: NativeTabConfirmedState,
  ) => {
    dispatch({ confirmed, type: 'CONFIRM_STATE' });
    props.navigation.dispatch({
      ...CommonActions.navigate(route.name, route.params),
      target: props.state.key,
    });
  };

  const onTabSelected = (event: NativeSyntheticEvent<TabSelectedEvent>) => {
    const { actionOrigin, provenance, selectedScreenKey } = event.nativeEvent;
    const confirmed = { provenance, routeKey: selectedScreenKey };
    const route = props.state.routes.find(
      item => item.key === selectedScreenKey,
    );
    if (!route) {
      return;
    }
    if (actionOrigin === 'user') {
      props.navigation.emit({
        canPreventDefault: true,
        target: route.key,
        type: 'tabPress',
      });
    }
    if (actionOrigin === 'programmatic-js' || focusedRouteKey === route.key) {
      dispatch({ confirmed, type: 'CONFIRM_STATE' });
      return;
    }
    navigate(route, confirmed);
  };

  const onTabSelectionRejected = (
    event: NativeSyntheticEvent<TabSelectionRejectedEvent>,
  ) => {
    const { provenance, selectedScreenKey } = event.nativeEvent;
    const confirmed = { provenance, routeKey: selectedScreenKey };
    const route = props.state.routes.find(
      item => item.key === selectedScreenKey,
    );
    if (!route) {
      return;
    }
    if (focusedRouteKey === route.key) {
      dispatch({ confirmed, type: 'CONFIRM_STATE' });
      return;
    }
    navigate(route, confirmed);
  };

  const onTabSelectionPrevented = (
    event: NativeSyntheticEvent<TabSelectionPreventedEvent>,
  ) => {
    const { provenance, selectedScreenKey } = event.nativeEvent;
    dispatch({
      confirmed: { provenance, routeKey: selectedScreenKey },
      type: 'CONFIRM_STATE',
    });
  };

  return (
    <NativeTabHostContext.Provider value>
      <Tabs.Host
        ios={{
          tabBarMinimizeBehavior: hvElement
            ? minimizeBehavior
            : TabBarMinimize.never,
        }}
        navStateRequest={{
          baseProvenance: nativeState.confirmed.provenance,
          selectedScreenKey: focusedRouteKey,
        }}
        onTabSelected={onTabSelected}
        onTabSelectionPrevented={onTabSelectionPrevented}
        onTabSelectionRejected={onTabSelectionRejected}
        rejectStaleNavStateUpdates
        tabBarHidden={!hvElement}
      >
        {props.state.routes.map(route => {
          const { render } = props.descriptors[route.key];
          const item = itemsByRoute[route.name];
          const ready = Boolean(hvElement);
          const icon = ready && item ? nativeTabIcon(item) : undefined;
          return (
            <Tabs.Screen
              key={route.key}
              android={{ icon }}
              badgeValue={ready ? item?.badgeValue : undefined}
              ios={{
                icon,
                overrideScrollViewContentInsetAdjustmentBehavior: true,
                selectedIcon: icon,
              }}
              screenKey={route.key}
              title={ready ? item?.label : undefined}
            >
              {render()}
            </Tabs.Screen>
          );
        })}
      </Tabs.Host>
    </NativeTabHostContext.Provider>
  );
};

/**
 * Native Tabs.Host whenever the demo is in glass mode. Custom mode keeps
 * JS BottomTabView so <navigation:bottom-tab-bar> children render.
 */
export const TabView = (props: TabViewProps): JSX.Element => {
  const { resolved } = useBottomTabBarContext();
  if (resolved === TabBarAppearance.glass) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <NativeScreensTabView {...props} />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BottomTabView {...props} />;
};
