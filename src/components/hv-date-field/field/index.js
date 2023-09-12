// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// $FlowFixMe: importing code from TypeScript
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
      onPressIn={props.onPress ? () => setPressed(true) : undefined}
      onPressOut={props.onPress ? () => setPressed(false) : undefined}
    >
      <View {...viewProps}>
        <Contexts.DateFormatContext.Consumer>
          {formatter => (
            <FieldLabel
              focused={props.focused}
              formatter={formatter}
              labelFormat={props.element.getAttribute('label-format')}
              placeholder={props.element.getAttribute('placeholder')}
              placeholderTextColor={props.element.getAttribute(
                'placeholderTextColor',
              )}
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
