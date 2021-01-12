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

  constructor(props: HvComponentProps) {
    super(props);
    this.setFocus = this.setFocus.bind(this);
  }

  setFocus = (focused: boolean) => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('focused', focused.toString());
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  render() {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused = this.props.element.getAttribute('focused') === 'true';
    const keyboardType =
      this.props.element.getAttribute('keyboard-type') || undefined;
    const props = {
      ...createProps(this.props.element, this.props.stylesheets, {
        ...this.props.options,
        focused,
      }),
      keyboardType,
      multiline: true,
      onBlur: () => this.setFocus(false),
      onChangeText: value => {
        const newElement = this.props.element.cloneNode(true);
        newElement.setAttribute('value', value);
        this.props.onUpdate(null, 'swap', this.props.element, { newElement });
      },
      onFocus: () => this.setFocus(true),
      ref: this.props.options.registerInputHandler,
      value: this.props.element.getAttribute('value'),
    };

    return React.createElement(TextInput, props);
  }
}
