// @flow

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
import { LOCAL_NAME } from 'hyperview/src/types';
import { Switch } from 'react-native';
import { getColors } from './colors';
import { getNameValueFormInputValues } from 'hyperview/src/services';

export default class HvSwitch extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SWITCH;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  props: HvComponentProps;

  render() {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const { iosBackgroundColor, thumbColor, trackColor } = getColors(
      this.props.element,
      this.props.stylesheets,
    );

    return (
      <Switch
        disabled={this.props.element.getAttribute('disabled') === 'true'}
        ios_backgroundColor={iosBackgroundColor}
        onChange={() => {
          const newElement = this.props.element.cloneNode(true);
          Behaviors.trigger('change', newElement, this.props.onUpdate);
        }}
        onValueChange={newValue => {
          const newElement = this.props.element.cloneNode(true);
          newElement.setAttribute('value', newValue ? 'on' : 'off');
          this.props.onUpdate(null, 'swap', this.props.element, { newElement });
        }}
        thumbColor={thumbColor}
        trackColor={trackColor}
        value={this.props.element.getAttribute('value') === 'on'}
      />
    );
  }
}
