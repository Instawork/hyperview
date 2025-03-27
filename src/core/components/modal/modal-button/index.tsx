import * as FontScale from 'hyperview/src/services/font-scale';
import React, { useState } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import type { Props } from './types';
import type { StyleSheet } from 'hyperview/src/types';
import { createStyleProp } from 'hyperview/src/services';

/**
 * Component used to render the Cancel/Done buttons in the picker modal.
 */
export default (props: Props) => {
  const [pressed, setPressed] = useState(false);

  const style: Array<StyleSheet> = createStyleProp(
    props.element,
    props.stylesheets,
    {
      ...props.options,
      pressed,
      styleAttr: 'modal-text-style',
    },
  );

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View>
        <Text style={style} {...FontScale.getFontScaleProps(props.element)}>
          {props.label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
