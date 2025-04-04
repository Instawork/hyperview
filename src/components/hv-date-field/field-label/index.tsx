import * as FontScale from 'hyperview/src/services/font-scale';
import type { Props } from './types';
import React from 'react';
import type { StyleSheet } from 'hyperview/src/types';
import { Text } from 'react-native';

/**
 * This text label of the field. Contains logic to decide how to format the value
 * or show the placeholder, including applying the right styles.
 */
export default (props: Props) => {
  const labelFormat = props.element.getAttribute('label-format');
  const placeholder = props.element.getAttribute('placeholder');
  const placeholderTextColor = props.element.getAttribute(
    'placeholderTextColor',
  );
  const labelStyles: Array<StyleSheet> = [props.style];
  if (!props.value && placeholderTextColor) {
    labelStyles.push({ color: placeholderTextColor });
  }

  const label: string | undefined = props.value
    ? props.formatter(props.value, labelFormat || undefined)
    : placeholder || '';

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Text style={labelStyles} {...FontScale.getFontScaleProps(props.element)}>
      {label}
    </Text>
  );
};
