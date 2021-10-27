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
      editable,
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
      textContentType: textContentType || 'none',
      value: this.props.element.getAttribute('value'),
    };

    return React.createElement(TextInput, props);
  }
}
