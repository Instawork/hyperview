import * as Render from 'hyperview/src/services/render';
import { NODE_TYPE } from 'hyperview';
import type { HvComponentOnUpdate } from 'hyperview';
import { TabBarContext } from '../../Contexts';
import type { Props } from './types';
import { useEffect, useState } from 'react';
import { useContext } from 'react';

/**
 * Component used by Hyperview to render a custom tab bar.
 * It retrieves the arguments needed by Hyperview render service
 * from TabBarContext. This works in tandem with the custom Hyperview
 * element <navigation:tabbar>
 */
export const TabBar = ({ id }: Props): JSX.Element | null => {
  // id is provided by Hyperview, and represents a tab navigator id
  const ctx = useContext(TabBarContext);

  // Props are the props received by the component backing the custom
  // Hyperview element <navigation:tabbar>
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
  }) as JSX.Element;
};
