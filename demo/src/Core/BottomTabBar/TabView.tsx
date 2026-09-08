import { TabBarAppearance, useBottomTabBarContext } from '../../Contexts';
import { BottomTabView } from '@react-navigation/bottom-tabs';
import { NativeScreensTabView } from './NativeScreensTabView';
import React from 'react';
import type { TabViewProps } from './types';

/**
 * Glass uses native Tabs.Host. Custom keeps JS BottomTabView so
 * <navigation:bottom-tab-bar> children render as they did originally.
 */
export function TabView(props: TabViewProps) {
  const { resolved } = useBottomTabBarContext();
  if (resolved === TabBarAppearance.glass) {
    return (
      <NativeScreensTabView
        descriptors={props.descriptors}
        navigation={props.navigation}
        state={props.state}
      />
    );
  }
  return (
    <BottomTabView
      descriptors={props.descriptors}
      detachInactiveScreens={props.detachInactiveScreens}
      navigation={props.navigation}
      safeAreaInsets={props.safeAreaInsets}
      sceneContainerStyle={props.sceneContainerStyle}
      state={props.state}
      tabBar={props.tabBar}
    />
  );
}
