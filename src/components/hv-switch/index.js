// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch } from 'react-native';
import {
  createStyleProp,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';

export default class HvSwitch extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SWITCH;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  props: HvComponentProps;

  render() {
    if (this.props.element.getAttribute('hide') === 'true') {
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
      onValueChange: value => {
        const newElement = this.props.element.cloneNode(true);
        newElement.setAttribute('value', value ? 'on' : 'off');
        this.props.onUpdate(null, 'swap', this.props.element, { newElement });
      },
      thumbColor: unselectedStyle ? unselectedStyle.color : null,
      trackColor: {
        false: unselectedStyle ? unselectedStyle.backgroundColor : null,
        true: selectedStyle ? selectedStyle.backgroundColor : null,
      },
      value: this.props.element.getAttribute('value') === 'on',
    };

    return React.createElement(Switch, props);
  }
}
