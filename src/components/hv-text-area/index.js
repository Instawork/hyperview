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
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvTextArea extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.TEXT_AREA;
  static localNameAliases = [];

  setFocus(focused: boolean) {
    const { element, onUpdate } = this.props;
    const newElement = element.cloneNode(true);
    newElement.setAttribute('focused', focused.toString());
    onUpdate(null, 'swap', element, { newElement });
  }

  render() {
    const { element, stylesheets, options } = this.props;

    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused = element.getAttribute('focused') === 'true';
    const keyboardType = element.getAttribute('keyboard-type') || undefined;
    const props = {
      ...createProps(element, stylesheets, { ...options, focused }),
      ref: options.registerInputHandler,
      multiline: true,
      value: element.getAttribute('value'),
      keyboardType,
      onFocus: () => this.setFocus(true),
      onBlur: () => this.setFocus(false),
      onChangeText: value => {
        const newElement = element.cloneNode(true);
        newElement.setAttribute('value', value);
        this.props.onUpdate(null, 'swap', element, { newElement });
      },
    };

    return React.createElement(TextInput, props);
  }
}
