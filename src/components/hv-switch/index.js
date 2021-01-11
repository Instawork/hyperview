// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { createStyleProp } from 'hyperview/src/services';

export default class HvSwitch extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SWITCH;

  static localNameAliases = [];

  props: HvComponentProps;

  render() {
    const { element, onUpdate } = this.props;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const unselectedStyle = StyleSheet.flatten(
      createStyleProp(this.props.element, this.props.stylesheets, {
        selected: false,
      }),
    );
    const selectedStyle = StyleSheet.flatten(
      createStyleProp(this.props.element, this.props.stylesheets, {
        selected: true,
      }),
    );

    const props = {
      ios_backgroundColor: unselectedStyle
        ? unselectedStyle.backgroundColor
        : null,
      thumbColor: unselectedStyle ? unselectedStyle.color : null,
      trackColor: {
        true: selectedStyle ? selectedStyle.backgroundColor : null,
        false: unselectedStyle ? unselectedStyle.backgroundColor : null,
      },
      value: element.getAttribute('value') === 'on',
      onValueChange: value => {
        const newElement = element.cloneNode(true);
        newElement.setAttribute('value', value ? 'on' : 'off');
        onUpdate(null, 'swap', element, { newElement });
      },
    };

    return React.createElement(Switch, props);
  }
}
