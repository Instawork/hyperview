import * as Contexts from 'hyperview/src/contexts';
import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useProps, useStyleProp } from 'hyperview/src/services';
import FieldLabel from '../field-label';
import type { Props } from './types';
import type { StyleSheet as StyleSheetType } from 'hyperview/src/types';

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
  const { pressedSelected, selected } = options;
  // Styles selected based on pressed state of the field.
  const [pressed, setPressed] = useState(false);

  // Create the props (including styles) for the box of the input field.
  const viewProps = useProps(element, stylesheets, {
    ...options,
    focused,
    pressed,
    styleAttr: 'field-style',
  });

  const labelStyle: StyleSheetType = StyleSheet.flatten(
    useStyleProp(element, stylesheets, {
      focused,
      pressed,
      pressedSelected,
      selected,
      styleAttr: 'field-text-style',
    }),
  );

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <View {...viewProps}>
        <Contexts.DateFormatContext.Consumer>
          {formatter => (
            <FieldLabel
              element={element}
              focused={focused}
              formatter={formatter}
              pressed={pressed}
              style={labelStyle}
              value={value}
            />
          )}
        </Contexts.DateFormatContext.Consumer>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};
