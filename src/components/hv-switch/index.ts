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
import { Platform, StyleSheet, Switch } from 'react-native';
import React, { PureComponent } from 'react';
import {
  createStyleProp,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import type { ColorValue } from './style-sheet';
import { LOCAL_NAME } from 'hyperview/src/types';
import normalizeColor from './style-sheet';

/* eslint no-bitwise: ["error", { "allow": [">>", "&"] }] */
function darkenColor(color: ColorValue, percent: number): ColorValue {
  const normalized = Number(normalizeColor(color)).toString(16);
  const A = String(normalized).slice(6);
  const RGB = parseInt(String(normalized).slice(0, 6), 16);
  const R = RGB >> 16;
  const G = (RGB >> 8) & 0x00ff;
  const B = RGB & 0x0000ff;
  const newRgb = (
    0x1000000 +
    (Math.round((0 - R) * percent) + R) * 0x10000 +
    (Math.round((0 - G) * percent) + G) * 0x100 +
    (Math.round((0 - B) * percent) + B)
  )
    .toString(16)
    .slice(1);

  return `#${newRgb}${A}`;
}

export default class HvSwitch extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SWITCH;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  render() {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const unselectedStyle = StyleSheet.flatten(
      createStyleProp(this.props.element, this.props.stylesheets, {
        selected: false,
      }),
    );
    const selectedStyle = StyleSheet.flatten(
      createStyleProp(this.props.element, this.props.stylesheets, {
        selected: true,
      }),
    );

    const props = {
      ios_backgroundColor: unselectedStyle
        ? unselectedStyle.backgroundColor
        : null,
      onChange: () => {
        const newElement = this.props.element.cloneNode(true);
        Behaviors.trigger('change', newElement, this.props.onUpdate);
      },
      onValueChange: (value: any) => {
        const newElement = this.props.element.cloneNode(true);
        newElement.setAttribute('value', value ? 'on' : 'off');
        if (this.props.onUpdate) {
          this.props.onUpdate(null, 'swap', this.props.element, { newElement });
        }
      },
      // iOS thumbColor default
      thumbColor: unselectedStyle?.color || selectedStyle?.color,
      trackColor: {
        false: unselectedStyle ? unselectedStyle.backgroundColor : null,
        true: selectedStyle ? selectedStyle.backgroundColor : null,
      },
      value: this.props.element.getAttribute('value') === 'on',
    };

    // android thumbColor default
    if (
      Platform.OS === 'android' &&
      !props.thumbColor &&
      props.trackColor.true
    ) {
      props.thumbColor = props.value
        ? darkenColor(props.trackColor.true, 0.3)
        : '#FFFFFF';
    }

    // if thumbColors are explicitly specified, override defaults
    if (props.value && selectedStyle?.color) {
      props.thumbColor = selectedStyle.color;
    } else if (!props.value && unselectedStyle?.color) {
      props.thumbColor = unselectedStyle.color;
    }

    return React.createElement(Switch, props);
  }
}
