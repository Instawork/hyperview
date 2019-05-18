// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import React, { PureComponent } from 'react';
import type { DOMString } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Props } from './types';
import { Picker } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvPicker extends PureComponent<Props> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.PICKER;
  state: {
    value: '',
  };

  constructor(props: Props) {
    const { element } = props;
    super(props);
    this.state = {
      value: element.getAttribute('value') || '',
    };
  }

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const props = {
      onValueChange: value => {
        this.setState({ value: value });
        element.setAttribute('value', value);
      },
      selectedValue: this.state.value,
    };

    const children = Array.from(
      element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    ).map(item =>
      React.createElement(Picker.Item, {
        label: item.getAttribute('label'),
        value: item.getAttribute('value'),
      }),
    );

    return React.createElement(Picker, props, ...children);
  }
}
