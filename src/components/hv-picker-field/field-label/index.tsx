import { StyleSheet, Text } from 'react-native';
import type { Props } from './types';
import React from 'react';
import type { StyleSheet as StyleSheetType } from 'hyperview/src/types';
import { createStyleProp } from 'hyperview/src/services';

/**
 * This text label of the field. Contains logic to decide how to format the value
 * or show the placeholder, including applying the right styles.
 */
export default (props: Props) => {
  const placeholder = props.element.getAttribute('placeholder');
  const placeholderTextColor = props.element.getAttribute(
    'placeholderTextColor',
  );
  const style: StyleSheetType = StyleSheet.flatten(
    createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      focused: props.focused,
      pressed: props.pressed,
      styleAttr: 'field-text-style',
    }),
  );

  const labelStyles: Array<StyleSheetType> = [style];
  if (!props.value && placeholderTextColor) {
    labelStyles.push({ color: placeholderTextColor });
  }

  const label: string = props.value ? props.value : placeholder || '';

  return <Text style={labelStyles}>{label}</Text>;
};
