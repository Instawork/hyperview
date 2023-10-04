/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  DOMString,
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { View } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvSelectSingle extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SELECT_SINGLE;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    const name = element.getAttribute('name');
    if (!name) {
      return [];
    }
    // Add each selected option to the form data
    const optionElements = element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      LOCAL_NAME.OPTION,
    );
    for (let i = 0; i < optionElements.length; i += 1) {
      const optionElement = optionElements.item(i);
      if (optionElement && optionElement.getAttribute('selected') === 'true') {
        return [[name, optionElement.getAttribute('value') || '']];
      }
    }
    return [];
  };

  constructor(props: HvComponentProps) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidUpdate() {
    // NOTE(adam): we need to remove the attribute before
    // selection, since selection will update the component.
    if (this.props.element.hasAttribute('value')) {
      const newValue = this.props.element.getAttribute('value');
      this.props.element.removeAttribute('value');
      this.onSelect(newValue);
    }
    if (this.props.element.hasAttribute('unselect-all')) {
      this.props.element.removeAttribute('unselect-all');
      this.onSelect(null);
    }
  }

  /**
   * Callback passed to children. Option components invoke this callback when selected.
   * SingleSelect will update the XML DOM so that only the selected option is has a
   * selected=true attribute.
   */
  onSelect = (selectedValue: DOMString | null | undefined) => {
    const newElement = this.props.element.cloneNode(true) as Element;
    const allowDeselect = this.props.element.getAttribute('allow-deselect');
    const options = newElement.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'option',
    );
    for (let i = 0; i < options.length; i += 1) {
      const opt = options.item(i);
      if (opt) {
        const value = opt.getAttribute('value');
        const current = value === selectedValue;
        if (current && allowDeselect) {
          // when deselection is allowed and user presses the option
          const selected = opt.getAttribute('selected') === 'true';
          opt.setAttribute('selected', selected ? 'false' : 'true');
        } else if (current) {
          // when deselection is not allowed and user presses the option
          opt.setAttribute('selected', 'true');
        } else {
          // untouched option
          opt.setAttribute('selected', 'false');
        }
      }
    }
    if (this.props.onUpdate) {
      this.props.onUpdate('#', 'swap', this.props.element, { newElement });
    }
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
        this.props.onUpdate as HvComponentOnUpdate,
        {
          ...this.props.options,
          onSelect: this.onSelect,
        },
      ),
    );
  }
}
