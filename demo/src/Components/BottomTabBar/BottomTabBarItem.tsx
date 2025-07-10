import type { HvComponentOnUpdate, HvComponentProps } from 'hyperview';
import { TouchableWithoutFeedback, View } from 'react-native';
import { createElement, useState } from 'react';
import { createEventHandler, createProps, renderChildren } from 'hyperview';
import { namespaceURI } from './constants';

const BottomTabBarItem = (props: HvComponentProps) => {
  const route = props.element.getAttributeNS(namespaceURI, 'route');
  const selected = route === props.options?.targetId;
  const [pressed, setPressed] = useState(false);

  // Updates options with pressed/selected state, so that child element can render
  // using the appropriate modifier styles.
  const newOptions = {
    ...props.options,
    pressed,
    pressedSelected: pressed && selected,
    selected,
  } as const;
  const p = createProps(props.element, props.stylesheets, newOptions);

  // Option renders as an outer TouchableWithoutFeedback view and inner view.
  // The outer view handles presses, the inner view handles styling.
  const outerProps = {
    onPress: createEventHandler(() => {
      props.options?.onSelect?.(route);
    }, true),
    onPressIn: createEventHandler(() => setPressed(true)),
    onPressOut: createEventHandler(() => setPressed(false)),
    style: {},
  };
  if (p.style && p.style.flex) {
    // Flex is a style that needs to be lifted from the inner component to the outer
    // component to ensure proper layout.
    outerProps.style = { flex: p.style.flex };
  }
  const component = createElement(
    View,
    p,
    ...renderChildren(
      props.element,
      props.stylesheets,
      props.onUpdate as HvComponentOnUpdate,
      newOptions,
    ),
  );
  return createElement(TouchableWithoutFeedback, outerProps, component);
};

BottomTabBarItem.namespaceURI = namespaceURI;
BottomTabBarItem.localName = 'bottom-tab-bar-item';

export { BottomTabBarItem };
