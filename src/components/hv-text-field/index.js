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
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput } from 'react-native';
import TinyMask from 'hyperview/src/mask.js';
import { createProps } from 'hyperview/src/services';

export default class HvTextField extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.TEXT_FIELD;
  static localNameAliases = [];
  constructor(props: HvComponentProps) {
    super(props);
    this.setFocus = this.setFocus.bind(this);
  }

  /**
   * Formats the user's input based on element attributes.
   * Currently supports the "mask" attribute, which will be applied
   * to format the provided value.
   */
  static getFormattedValue = (element: Element, value: string) => {
    if (!element.hasAttribute('mask')) {
      return value;
    }
    const mask = new TinyMask(element.getAttribute('mask'));
    // TinyMask returns undefined in some cases (like if the value is an empty string).
    // In those situations, we want the formatted value to be an empty string
    // (for proper serialization).
    return mask.mask(value) || '';
  };

  setFocus = (focused: boolean) => {
    const { element, onUpdate } = this.props;
    const newElement = element.cloneNode(true);
    newElement.setAttribute('focused', focused.toString());
    onUpdate(null, 'swap', element, { newElement });
  };

  render() {
    const { element, stylesheets, options } = this.props;

    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused = element.getAttribute('focused') === 'true';
    const keyboardType = element.getAttribute('keyboard-type') || undefined;
    const props = {
      ...createProps(element, stylesheets, { ...options, focused }),
      autoFocus: element.getAttribute('auto-focus') === 'true',
      secureTextEntry: element.getAttribute('secure-text') === 'true',
      ref: options.registerInputHandler,
      multiline: false,
      value: element.getAttribute('value'),
      keyboardType,
      onFocus: () => this.setFocus(true),
      onBlur: () => this.setFocus(false),
      onChangeText: value => {
        const formattedValue = HvTextField.getFormattedValue(element, value);
        const newElement = element.cloneNode(true);
        newElement.setAttribute('value', formattedValue);
        this.props.onUpdate(null, 'swap', element, { newElement });
      },
    };

    return React.createElement(TextInput, props);
  }
}
