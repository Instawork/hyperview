// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { createStyleProp } from 'hyperview/src/services';

export default class HvSwitch extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.SWITCH;
  constructor(props: Props) {
    const { element } = props;
    super(props);
    const initialValue = element.getAttribute('value') === 'on';
    this.state = {
      value: initialValue,
    };
  }

  render() {
    const { element, stylesheets } = this.props;

    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const unselectedStyle = StyleSheet.flatten(
      createStyleProp(element, stylesheets, { selected: false }),
    );
    const selectedStyle = StyleSheet.flatten(
      createStyleProp(element, stylesheets, { selected: true }),
    );

    const props = {
      ios_backgroundColor: unselectedStyle
        ? unselectedStyle.backgroundColor
        : null,
      trackColor: {
        true: selectedStyle ? selectedStyle.backgroundColor : null,
        false: unselectedStyle ? unselectedStyle.backgroundColor : null,
      },
      value: this.state.value,
      onValueChange: value => {
        // Render the formatted value and store the formatted value
        // in state (on the XML element).
        this.setState({ value });
        element.setAttribute('value', value ? 'on' : 'off');
      },
    };

    return React.createElement(Switch, props);
  }
}
