import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { createEventHandler } from 'hyperview/src/core/utils';
import { createProps } from 'hyperview/src/services';

/**
 * A component representing an option in a single-select or multiple-select list.
 * Has a local pressed state. The selected state is read from the element attribute.
 */
const HvOption = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { onSelect, onToggle } = options;
  const [pressed, setPressed] = useState(false);
  const prevProps = useRef<HvComponentProps>(props);

  const value = element.getAttribute('value');
  const selected = element.getAttribute('selected') === 'true';

  // Updates options with pressed/selected state, so that child element can render
  // using the appropriate modifier styles.
  const newOptions = {
    ...options,
    pressed,
    pressedSelected: pressed && selected,
    selected,
  } as const;
  const componentProps = createProps(element, stylesheets, newOptions);

  // Option renders as an outer TouchableWithoutFeedback view and inner view.
  // The outer view handles presses, the inner view handles styling.
  const outerProps = {
    onPress: createEventHandler(() => {
      if (onSelect) {
        // Updates the DOM state, causing this element to re-render as selected.
        // Used in select-single context.
        onSelect(value);
      }
      if (onToggle) {
        // Updates the DOM state, toggling this element.
        // Used in select-multiple context.
        onToggle(value);
      }
    }, true),
    onPressIn: createEventHandler(() => setPressed(true)),
    onPressOut: createEventHandler(() => setPressed(false)),
    style: {},
  };
  if (componentProps.style && componentProps.style.flex) {
    // Flex is a style that needs to be lifted from the inner component to the outer
    // component to ensure proper layout.
    outerProps.style = { flex: componentProps.style.flex };
  }

  useEffect(() => {
    const prevSelected =
      prevProps.current?.element.getAttribute('selected') === 'true';
    if (selected && !prevSelected) {
      Behaviors.trigger('select', element, onUpdate);
    }

    if (!selected && prevSelected) {
      Behaviors.trigger('deselect', element, onUpdate);
    }
    prevProps.current = props;
  }, [element, onUpdate, props, selected]);

  // TODO: Replace with <HvChildren>
  return React.createElement(
    TouchableWithoutFeedback,
    outerProps,
    React.createElement(
      View,
      componentProps,
      ...Render.renderChildren(
        element,
        stylesheets,
        onUpdate as HvComponentOnUpdate,
        newOptions,
      ),
    ),
  );
};

HvOption.namespaceURI = Namespaces.HYPERVIEW;
HvOption.localName = LOCAL_NAME.OPTION;

export default HvOption;
