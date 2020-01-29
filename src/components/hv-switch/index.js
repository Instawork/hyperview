// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { State } from './types';
import { createStyleProp } from 'hyperview/src/services';

export default class HvSwitch extends PureComponent<HvComponentProps, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.SWITCH;
  props: HvComponentProps;
  state: State;

  constructor(props: HvComponentProps) {
    super(props);
    const initialValue = props.element.getAttribute('value') === 'on';
    this.state = {
      value: initialValue,
    };
  }

  static getDerivedStateFromProps(
    nextProps: HvComponentProps,
    prevState: State,
  ) {
    const value = nextProps.element.getAttribute('value') === 'on';
    return value !== prevState.value ? { value } : {};
  }

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
      trackColor: {
        true: selectedStyle ? selectedStyle.backgroundColor : null,
        false: unselectedStyle ? unselectedStyle.backgroundColor : null,
      },
      value: this.state.value,
      onValueChange: value => {
        // Render the formatted value and store the formatted value
        // in state (on the XML element).
        this.setState({ value });
        this.props.element.setAttribute('value', value ? 'on' : 'off');
      },
    };

    return React.createElement(Switch, props);
  }
}
