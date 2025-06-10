import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { createEventHandler } from 'hyperview/src/core/hyper-ref';
import { useProps } from 'hyperview/src/services';

/**
 * A component representing an option in a single-select or multiple-select list.
 * Has a local pressed state. The selected state is read from the element attribute.
 */
const HvOption = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const [pressed, setPressed] = useState(false);
  const { onSelect, onToggle } = options;
  const value = useMemo(() => element.getAttribute('value'), [element]);
  const selected = useMemo(() => element.getAttribute('selected') === 'true', [
    element,
  ]);
  const prevSelected = useRef(selected);

  // Updates options with pressed/selected state, so that child element can render
  // using the appropriate modifier styles.
  const newOptions = useMemo(() => {
    return {
      ...options,
      pressed,
      pressedSelected: pressed && selected,
      selected,
    } as const;
  }, [options, pressed, selected]);

  const componentProps = useProps(element, stylesheets, newOptions);

  const flex = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO: fix this
    return componentProps.style?.flex;
  }, [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO: fix this
    componentProps.style?.flex,
  ]);

  const handlePress = useCallback(() => {
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
  }, [onSelect, onToggle, value]);

  const handlePressIn = useCallback(() => setPressed(true), []);
  const handlePressOut = useCallback(() => setPressed(false), []);

  // Option renders as an outer TouchableWithoutFeedback view and inner view.
  // The outer view handles presses, the inner view handles styling.
  const outerProps = useMemo(() => {
    return {
      onPress: createEventHandler(handlePress, true),
      onPressIn: createEventHandler(handlePressIn),
      onPressOut: createEventHandler(handlePressOut),

      // Flex is a style that needs to be lifted from the inner component to the outer
      // component to ensure proper layout.
      style: flex ? { flex } : {},
    };
  }, [flex, handlePress, handlePressIn, handlePressOut]);

  // TODO: Replace with <HvChildren>
  const children = useMemo(() => {
    return Render.renderChildren(
      element,
      stylesheets,
      onUpdate as HvComponentOnUpdate,
      newOptions,
    );
  }, [element, newOptions, onUpdate, stylesheets]);

  useEffect(() => {
    if (selected && !prevSelected.current) {
      Behaviors.trigger('select', element, onUpdate);
    }

    if (!selected && prevSelected.current) {
      Behaviors.trigger('deselect', element, onUpdate);
    }
    prevSelected.current = selected;
  }, [element, onUpdate, selected]);

  const view = useMemo(() => {
    return React.createElement(View, componentProps, ...children);
  }, [componentProps, children]);

  return useMemo(
    () => React.createElement(TouchableWithoutFeedback, outerProps, view),
    [outerProps, view],
  );
};

HvOption.namespaceURI = Namespaces.HYPERVIEW;
HvOption.localName = LOCAL_NAME.OPTION;

export default HvOption;
