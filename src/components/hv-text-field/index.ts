/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import {
  createProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput } from 'react-native';
import TinyMask from 'hyperview/src/mask.ts';

export default class HvTextField extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.TEXT_FIELD;

  static localNameAliases = [LOCAL_NAME.TEXT_AREA];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  constructor(props: HvComponentProps) {
    super(props);
    this.setFocus = this.setFocus.bind(this);
    if (this.props.element.localName === LOCAL_NAME.TEXT_AREA) {
      console.warn(
        'Deprecation notice: <text-area> tag is deprecated and will be removed in a future version. See https://hyperview.org/docs/reference_textarea for details.',
      );
    }
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
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('focused', focused.toString());
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });

    if (focused) {
      Behaviors.trigger('focus', newElement, this.props.onUpdate);
    } else {
      Behaviors.trigger('blur', newElement, this.props.onUpdate);
    }
  };

  render() {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused = this.props.element.getAttribute('focused') === 'true';
    const editable = this.props.element.getAttribute('editable') !== 'false';
    const textContentType = this.props.element.getAttribute(
      'text-content-type',
    );
    const keyboardType =
      this.props.element.getAttribute('keyboard-type') || undefined;
    const props = {
      ...createProps(this.props.element, this.props.stylesheets, {
        ...this.props.options,
        focused,
      }),
      autoFocus: this.props.element.getAttribute('auto-focus') === 'true',
      editable,
      keyboardType,
      multiline:
        this.props.element.localName === LOCAL_NAME.TEXT_AREA ||
        this.props.element.getAttribute('multiline') === 'true',
      onBlur: () => this.setFocus(false),
      onChangeText: value => {
        const formattedValue = HvTextField.getFormattedValue(
          this.props.element,
          value,
        );
        const newElement = this.props.element.cloneNode(true);
        newElement.setAttribute('value', formattedValue);
        this.props.onUpdate(null, 'swap', this.props.element, { newElement });
        Behaviors.trigger('change', newElement, this.props.onUpdate);
      },
      onFocus: () => this.setFocus(true),
      ref: this.props.options.registerInputHandler,
      secureTextEntry:
        this.props.element.getAttribute('secure-text') === 'true',
      textContentType: textContentType || 'none',
      value: this.props.element.getAttribute('value'),
    } as const;

    return React.createElement(TextInput, props);
  }
}
