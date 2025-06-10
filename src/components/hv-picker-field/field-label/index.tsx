import * as FontScale from 'hyperview/src/services/font-scale';
import { StyleSheet, Text } from 'react-native';
import type { Props } from './types';
import React from 'react';
import type { StyleSheet as StyleSheetType } from 'hyperview/src/types';
import { useStyleProp } from 'hyperview/src/services';

/**
 * This text label of the field. Contains logic to decide how to format the value
 * or show the placeholder, including applying the right styles.
 */
export default (props: Props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, focused, pressed, options, stylesheets, value } = props;
  const { pressedSelected, selected } = options;
  const placeholder = element.getAttribute('placeholder');
  const placeholderTextColor = element.getAttribute('placeholderTextColor');
  const style: StyleSheetType = StyleSheet.flatten(
    useStyleProp(element, stylesheets, {
      focused,
      pressed,
      pressedSelected,
      selected,
      styleAttr: 'field-text-style',
    }),
  );

  const labelStyles: Array<StyleSheetType> = [style];
  if (!value && placeholderTextColor) {
    labelStyles.push({ color: placeholderTextColor });
  }

  const label: string = value || placeholder || '';

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Text style={labelStyles} {...FontScale.getFontScaleProps(element)}>
      {label}
    </Text>
  );
};
