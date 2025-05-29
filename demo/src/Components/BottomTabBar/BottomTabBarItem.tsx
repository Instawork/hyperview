import React, { useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import type { HvComponentProps } from 'hyperview';
import Hyperview from 'hyperview';
import { createEventHandler } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';
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
  return (
    <TouchableWithoutFeedback
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...outerProps}
    >
      <View
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...p}
      >
        <Hyperview.HvChildren
          element={props.element}
          onUpdate={props.onUpdate}
          options={newOptions}
          stylesheets={props.stylesheets}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

BottomTabBarItem.namespaceURI = namespaceURI;
BottomTabBarItem.localName = 'bottom-tab-bar-item';

export { BottomTabBarItem };
