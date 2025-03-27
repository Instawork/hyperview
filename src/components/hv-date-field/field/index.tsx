import * as Contexts from 'hyperview/src/contexts';
import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { createProps, createStyleProp } from 'hyperview/src/services';
import FieldLabel from '../field-label';
import type { Props } from './types';
import type { StyleSheet as StyleSheetType } from 'hyperview/src/types';

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

  const labelStyle: StyleSheetType = StyleSheet.flatten(
    createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      focused: props.focused,
      pressed,
      styleAttr: 'field-text-style',
    }),
  );

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View {...viewProps}>
        <Contexts.DateFormatContext.Consumer>
          {formatter => (
            <FieldLabel
              element={props.element}
              focused={props.focused}
              formatter={formatter}
              pressed={pressed}
              style={labelStyle}
              value={props.value}
            />
          )}
        </Contexts.DateFormatContext.Consumer>
        {props.children}
      </View>
    </TouchableWithoutFeedback>
  );
};
