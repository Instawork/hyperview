/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {useState} from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import type { Props } from './types';

/**
 * Component used to render the Cancel/Done buttons in the picker modal.
 */
export default (props: Props) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View>
        <Text style={props.getStyle(pressed)}>{props.label}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
