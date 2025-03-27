import React, { useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import FieldLabel from '../field-label';
import type { Props } from './types';
import { createProps } from 'hyperview/src/services';

/**
 * The input field component. This is a box with text in it.
 * Tapping the box focuses the field and brings up the date picker.
 */
export default (props: Props) => {
  // Styles selected based on pressed state of the field.
  const [pressed, setPressed] = useState(false);

  // Create the props (including styles) for the box of the input field.
  const viewProps = createProps(props.element, props.stylesheets, {
    ...props.options,
    focused: props.focused,
    pressed,
    styleAttr: 'field-style',
  });

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...viewProps}
      >
        <FieldLabel
          element={props.element}
          focused={props.focused}
          options={props.options}
          pressed={pressed}
          stylesheets={props.stylesheets}
          value={props.value}
        />
        {props.children}
      </View>
    </TouchableWithoutFeedback>
  );
};
