import * as Render from 'hyperview/src/services/render';
import type { Props } from './types';
import { useBottomTabBarContext } from '../../Contexts';
import { useCallback } from 'react';

/**
 * Component used by Hyperview to render a custom bottom tab bar.
 * It retrieves the arguments needed by Hyperview render service
 * from BottomTabBarContext. This works in tandem with the custom Hyperview
 * element <navigation:bottom-tab-bar>
 */
export const BottomTabBar = (navProps: Props): JSX.Element | null => {
  const { id, state, navigation } = navProps;
  // id is provided by Hyperview, and represents a tab navigator id
  const { getElementProps, setElement } = useBottomTabBarContext();

  // Props are the props received by the component backing the custom
  // Hyperview element <navigation:bottom-tab-bar>
  const props = getElementProps?.(id);
  const { onUpdate } = props || {};

  const onUpdateCustom = useCallback(
    (href, action, currentElement, opts) => {
      if (action === 'swap' && opts?.newElement) {
        if (currentElement.parentNode) {
          const newElement = currentElement.parentNode as Element;
          newElement.replaceChild(opts.newElement, currentElement);
          setElement?.(id, newElement);
        } else {
          console.warn('Parent node is null. Cannot replace child element.');
        }
      } else {
        onUpdate?.(href, action, currentElement, opts);
      }
    },
    [id, setElement, onUpdate],
  );
  if (!props) {
    return null;
  }

  return (Render.renderChildren(
    props.element,
    props.stylesheets,
    onUpdateCustom,
    {
      ...props.options,
      onSelect: (route: string | null | undefined) => {
        if (route) {
          navigation.navigate(route);
        }
      },
      targetId: state.routes[state.index].name,
    },
  ) as unknown) as JSX.Element;
};
