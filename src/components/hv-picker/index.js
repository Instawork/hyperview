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
import { Picker } from 'react-native';

export default class HvPicker extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.PICKER;
  state: State = {
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
    const { element } = this.props;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const props = {
      onValueChange: value => {
        this.setState({ value });
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
