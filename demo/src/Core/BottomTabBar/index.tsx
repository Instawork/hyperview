import * as Render from 'hyperview/src/services/render';
import { useContext, useEffect, useState } from 'react';
import { BottomTabBarContext } from '../../Contexts';
import type { HvComponentOnUpdate } from 'hyperview';
import { NODE_TYPE } from 'hyperview';
import type { Props } from './types';

/**
 * Component used by Hyperview to render a custom bottom tab bar.
 * It retrieves the arguments needed by Hyperview render service
 * from BottomTabBarContext. This works in tandem with the custom Hyperview
 * element <navigation:bottom-tab-bar>
 */
export const BottomTabBar = ({ id }: Props): JSX.Element | null => {
  // id is provided by Hyperview, and represents a tab navigator id
  const ctx = useContext(BottomTabBarContext);

  // Props are the props received by the component backing the custom
  // Hyperview element <navigation:bottom-tab-bar>
  const props = ctx.elementsProps?.[id];

  // It is assumed here the component will nest a single child
  const child = Array.from(props?.element?.childNodes || []).find(
    node => node.nodeType === NODE_TYPE.ELEMENT_NODE,
  ) as Element | undefined;

  // Since the state of the element is no longer held by the screen's doc
  // that provides it, we create a local state to store the child element
  // and keep it in sync with the child provided by the props
  const [element, setElement] = useState<Element | undefined>(child);
  useEffect(() => {
    setElement(child);
  }, [child]);
  if (!props || !child) {
    return null;
  }

  // We override onUpdate to handle local state update, and delegate
  // to props.onUpdate for any other treatments (i.e. behaviors etc.)
  const onUpdate: HvComponentOnUpdate = (
    href,
    action,
    currentElement,
    opts,
  ) => {
    setTimeout(() => props.onUpdate(href, action, props.element, opts), 0);
    if (action === 'swap' && opts.newElement) {
      setElement(opts.newElement);
    }
  };

  return Render.renderElement(element, props.stylesheets, onUpdate, {
    componentRegistry: props.options?.componentRegistry,
  }) as JSX.Element | null;
};
