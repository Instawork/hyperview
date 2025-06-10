import React, { useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import FieldLabel from '../field-label';
import type { Props } from './types';
import { useProps } from 'hyperview/src/services';

/**
 * The input field component. This is a box with text in it.
 * Tapping the box focuses the field and brings up the date picker.
 */
export default (props: Props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const {
    children,
    element,
    focused,
    onPress,
    options,
    stylesheets,
    value,
  } = props;
  // Styles selected based on pressed state of the field.
  const [pressed, setPressed] = useState(false);

  // Create the props (including styles) for the box of the input field.
  const viewProps = useProps(element, stylesheets, {
    ...options,
    focused,
    pressed,
    styleAttr: 'field-style',
  });

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...viewProps}
      >
        <FieldLabel
          element={element}
          focused={focused}
          options={options}
          pressed={pressed}
          stylesheets={stylesheets}
          value={value}
        />
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};
