// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import {
  createProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput } from 'react-native';
import TinyMask from 'hyperview/src/mask.js';

export default class HvTextField extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.TEXT_FIELD;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  constructor(props: HvComponentProps) {
    super(props);
    this.setFocus = this.setFocus.bind(this);
  }

  triggerFocusBehaviors = (newElement: Element) => {
    const behaviorElements = Dom.getBehaviorElements(this.props.element);
    const focusBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'focus',
    );
    focusBehaviors.forEach(behaviorElement => {
      const href = behaviorElement.getAttribute('href');
      const action = behaviorElement.getAttribute('action');
      const verb = behaviorElement.getAttribute('verb');
      const targetId = behaviorElement.getAttribute('target');
      const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
      const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
      const delay = behaviorElement.getAttribute('delay');
      const once = behaviorElement.getAttribute('once');
      this.props.onUpdate(href, action, newElement, {
        behaviorElement,
        delay,
        hideIndicatorIds,
        once,
        showIndicatorIds,
        targetId,
        verb,
      });
    });
  };

  triggerBlurBehaviors = (newElement: Element) => {
    const behaviorElements = Dom.getBehaviorElements(this.props.element);
    const blurBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'blur',
    );
    blurBehaviors.forEach(behaviorElement => {
      const href = behaviorElement.getAttribute('href');
      const action = behaviorElement.getAttribute('action');
      const verb = behaviorElement.getAttribute('verb');
      const targetId = behaviorElement.getAttribute('target');
      const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
      const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
      const delay = behaviorElement.getAttribute('delay');
      const once = behaviorElement.getAttribute('once');
      this.props.onUpdate(href, action, newElement, {
        behaviorElement,
        delay,
        hideIndicatorIds,
        once,
        showIndicatorIds,
        targetId,
        verb,
      });
    });
  };

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
      this.triggerFocusBehaviors(newElement);
    } else {
      this.triggerBlurBehaviors(newElement);
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
      multiline: false,
      onBlur: () => this.setFocus(false),
      onChangeText: value => {
        const formattedValue = HvTextField.getFormattedValue(
          this.props.element,
          value,
        );
        const newElement = this.props.element.cloneNode(true);
        newElement.setAttribute('value', formattedValue);
        this.props.onUpdate(null, 'swap', this.props.element, { newElement });
      },
      onFocus: () => this.setFocus(true),
      ref: this.props.options.registerInputHandler,
      secureTextEntry:
        this.props.element.getAttribute('secure-text') === 'true',
      textContentType: textContentType || 'none',
      value: this.props.element.getAttribute('value'),
    };

    return React.createElement(TextInput, props);
  }
}
