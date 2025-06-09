import * as FontScale from 'hyperview/src/services/font-scale';
import React, { useState } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import type { Props } from './types';
import type { StyleSheet } from 'hyperview/src/types';
import { useStyleProp } from 'hyperview/src/services';

/**
 * Component used to render the Cancel/Done buttons in the picker modal.
 */
export default (props: Props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, label, onPress, options, stylesheets } = props;
  const { focused, pressedSelected, selected } = options;
  const [pressed, setPressed] = useState(false);

  const style: Array<StyleSheet> = useStyleProp(element, stylesheets, {
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr: 'modal-text-style',
  });

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Text style={style} {...FontScale.getFontScaleProps(element)}>
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
