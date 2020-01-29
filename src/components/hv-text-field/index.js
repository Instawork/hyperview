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
import type { State } from './types';
import { TextInput } from 'react-native';
import TinyMask from 'hyperview/src/mask.js';
import { createProps } from 'hyperview/src/services';

export default class HvTextField extends PureComponent<
  HvComponentProps,
  State,
> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.TEXT_FIELD;
  constructor(props: HvComponentProps) {
    const { element } = props;
    super(props);
    this.state = {
      focused: false,
      value: element.getAttribute('value') || '',
    };
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

  static getDerivedStateFromProps(
    nextProps: HvComponentProps,
    prevState: State,
  ) {
    const { element } = nextProps;
    const newValue = HvTextField.getFormattedValue(
      element,
      element.getAttribute('value') || '',
    );
    return newValue !== prevState.value
      ? { focused: prevState.focused, value: newValue }
      : prevState;
  }

  render() {
    const { element, stylesheets, options } = this.props;

    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const { focused } = this.state;
    const keyboardType = element.getAttribute('keyboard-type') || undefined;
    const props = {
      ...createProps(element, stylesheets, { ...options, focused }),
      autoFocus: element.getAttribute('auto-focus') === 'true',
      ref: options.registerInputHandler,
      multiline: false,
      value: this.state.value,
      keyboardType,
      onFocus: () => this.setState({ focused: true }),
      onBlur: () => this.setState({ focused: false }),
      onChangeText: value => {
        // Render the formatted value and store the formatted value
        // in state (on the XML element).
        const formattedValue = HvTextField.getFormattedValue(element, value);
        this.setState({ value: formattedValue });
        element.setAttribute('value', formattedValue);
      },
    };

    return React.createElement(TextInput, props);
  }
}
