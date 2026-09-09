import { getNativeTabItems, isLiquidGlassSupported } from './helpers';
import type { BottomTabViewProps } from './types';
import NativeTabView from './NativeTabView';
import { BottomTabView as RNBottomTabView } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useBottomTabBarContext } from '../../Contexts';

export const BottomTabView = (props: BottomTabViewProps) => {
  const { getElementProps } = useBottomTabBarContext();
  const navigatorId = props.navigation.getId?.();
  const items =
    isLiquidGlassSupported() && getElementProps && navigatorId
      ? getNativeTabItems(getElementProps(navigatorId))
      : false;

  if (items) {
    return (
      <NativeTabView
        descriptors={props.descriptors}
        items={items}
        navigation={props.navigation}
        state={props.state}
      />
    );
  }

  return (
    <RNBottomTabView
      descriptors={props.descriptors}
      detachInactiveScreens={props.detachInactiveScreens}
      navigation={props.navigation}
      safeAreaInsets={props.safeAreaInsets}
      sceneContainerStyle={props.sceneContainerStyle}
      state={props.state}
      tabBar={items === undefined ? () => null : props.tabBar}
    />
  );
};
