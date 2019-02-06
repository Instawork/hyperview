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
import { View } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvSelectMultiple extends PureComponent<Props> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.SELECT_MULTIPLE;
  constructor(props: Props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
  }

  /**
   * Callback passed to children. Option components invoke this callback when toggles.
   * Will update the XML DOM to toggle the option with the given value.
   */
  onToggle = (selectedValue: ?DOMString) => {
    const { element, onUpdate } = this.props;
    const newElement = element.cloneNode(true);
    const options = newElement.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'option',
    );
    for (let i = 0; i < options.length; i += 1) {
      const option = options.item(i);
      if (option) {
        const value = option.getAttribute('value');
        if (value === selectedValue) {
          const selected = option.getAttribute('selected') === 'true';
          option.setAttribute('selected', selected ? 'false' : 'true');
        }
      }
    }
    onUpdate('#', 'swap', element, { newElement });
  };

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }
    const props = createProps(element, stylesheets, { ...options });
    return React.createElement(
      View,
      props,
      ...Render.renderChildren(element, stylesheets, onUpdate, {
        ...options,
        onToggle: this.onToggle,
      }),
    );
  }
}
