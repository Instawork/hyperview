// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import { Platform, StyleSheet, Switch } from 'react-native';
import React, { PureComponent } from 'react';
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
      onChange: () => {
        const newElement = this.props.element.cloneNode(true);
        Dom.triggerBehaviors(newElement, 'change', this.props.onUpdate);
      },
      onValueChange: value => {
        const newElement = this.props.element.cloneNode(true);
        newElement.setAttribute('value', value ? 'on' : 'off');
        this.props.onUpdate(null, 'swap', this.props.element, { newElement });
      },
      // iOS thumbColor default
      thumbColor: unselectedStyle?.color || selectedStyle?.color,
      trackColor: {
        false: unselectedStyle ? unselectedStyle.backgroundColor : null,
        true: selectedStyle ? selectedStyle.backgroundColor : null,
      },
      value: this.props.element.getAttribute('value') === 'on',
    };

    // android thumbColor default
    if (Platform.OS === 'android' && !props.thumbColor) {
      props.thumbColor = props.value ? '#406be4' : '#FFFFFF';
    }

    // if thumbColors are explicitly specified, override defaults
    if (props.value && selectedStyle?.color) {
      props.thumbColor = selectedStyle.color;
    } else if (!props.value && unselectedStyle?.color) {
      props.thumbColor = unselectedStyle.color;
    }

    return React.createElement(Switch, props);
  }
}
