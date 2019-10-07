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
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvTextArea extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.TEXT_AREA;
  constructor(props: Props) {
    const { element } = props;
    super(props);
    this.state = {
      focused: false,
      value: element.getAttribute('value') || '',
    };
  }

  componentDidUpdate() {
    const { element } = this.props;
    const newValue = element.getAttribute('value') || '';
    if (newValue !== this.state.value) {
      this.setState({ value: newValue });
    }
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
      ref: options.registerInputHandler,
      multiline: true,
      value: this.state.value,
      keyboardType,
      onFocus: () => this.setState({ focused: true }),
      onBlur: () => this.setState({ focused: false }),
      onChangeText: value => {
        this.setState({ value });
        element.setAttribute('value', value);
      },
    };

    return React.createElement(TextInput, props);
  }
}
