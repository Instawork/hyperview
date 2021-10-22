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
import type { DOMString, HvComponentProps } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { View } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvSelectMultiple extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SELECT_MULTIPLE;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<string> => {
    const values: Array<string> = [];
    // Add each selected option to the form data
    const optionElements: NodeList<Element> = element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      LOCAL_NAME.OPTION,
    );
    for (let i = 0; i < optionElements.length; i += 1) {
      const optionElement = optionElements.item(i);
      if (optionElement && optionElement.getAttribute('selected') === 'true') {
        values.push(optionElement.getAttribute('value') || '');
      }
    }
    return values;
  };

  constructor(props: HvComponentProps) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
  }

  /**
   * Callback passed to children. Option components invoke this callback when toggles.
   * Will update the XML DOM to toggle the option with the given value.
   */
  onToggle = (selectedValue: ?DOMString) => {
    const newElement = this.props.element.cloneNode(true);
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
    this.props.onUpdate('#', 'swap', this.props.element, { newElement });
  };

  render() {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }
    const props = createProps(this.props.element, this.props.stylesheets, {
      ...this.props.options,
    });
    return React.createElement(
      View,
      props,
      ...Render.renderChildren(
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate,
        {
          ...this.props.options,
          onToggle: this.onToggle,
        },
      ),
    );
  }
}
