import * as Behaviors from 'hyperview/src/services/behaviors';
import React, { useCallback } from 'react';
import type { HeaderProps } from './types';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

const HeaderView = (props: HeaderProps) => {
  const { navigationComponents } = useHyperview();
  const HeaderViewComponent = navigationComponents?.HeaderView;
  const onPress = useCallback(
    (element: Element) =>
      Behaviors.triggerPressBehaviors(element, props.onUpdate),
    [props.onUpdate],
  );
  if (!HeaderViewComponent) {
    return props.children;
  }
  return (
    <HeaderViewComponent
      element={props.element}
      isRouteLoading={props.isRouteLoading}
      onPress={onPress}
    >
      {props.children}
    </HeaderViewComponent>
  );
};

export default HeaderView;
