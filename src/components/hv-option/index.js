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
import * as Render from 'hyperview/src/services/render';
import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { State } from './types';
import { createEventHandler } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';

/**
 * A component representing an option in a single-select or multiple-select list.
 * Has a local pressed state. The selected state is read from the element attribute.
 */
export default class HvOption extends PureComponent<HvComponentProps, State> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.OPTION;

  static localNameAliases = [];

  props: HvComponentProps;

  state: State = {
    pressed: false,
  };

  componentDidUpdate(prevProps: HvComponentProps) {
    const selected = this.props.element.getAttribute('selected') === 'true';
    const prevSelected = prevProps.element.getAttribute('selected') === 'true';
    if (selected && !prevSelected) {
      Behaviors.trigger('select', this.props.element, this.props.onUpdate);
    }

    if (!selected && prevSelected) {
      Behaviors.trigger('deselect', this.props.element, this.props.onUpdate);
    }
  }

  render() {
    const { onSelect, onToggle } = this.props.options;

    const value = this.props.element.getAttribute('value');
    const selected = this.props.element.getAttribute('selected') === 'true';
    const disabled = this.props.element.getAttribute('disabled') === 'true';

    // Updates options with pressed/selected state, so that child element can render
    // using the appropriate modifier styles.
    const newOptions = {
      ...this.props.options,
      disabled,
      pressed: this.state.pressed,
      pressedSelected: this.state.pressed && selected,
      selected,
      selectedDisabled: selected && disabled,
    };
    const props = createProps(
      this.props.element,
      this.props.stylesheets,
      newOptions,
    );

    // Option renders as an outer TouchableWithoutFeedback view and inner view.
    // The outer view handles presses, the inner view handles styling.
    const outerProps = {
      onPress: !disabled
        ? createEventHandler(() => {
            if (onSelect) {
              // Updates the DOM state, causing this element to re-render as selected.
              // Used in select-single context.
              onSelect(value);
            }
            if (onToggle) {
              // Updates the DOM state, toggling this element.
              // Used in select-multiple context.
              onToggle(value);
            }
          }, true)
        : undefined,
      onPressIn: !disabled
        ? createEventHandler(() => this.setState({ pressed: true }))
        : undefined,
      onPressOut: !disabled
        ? createEventHandler(() => this.setState({ pressed: false }))
        : undefined,
      style: undefined,
    };
    if (props.style && props.style.flex) {
      // Flex is a style that needs to be lifted from the inner component to the outer
      // component to ensure proper layout.
      outerProps.style = { flex: props.style.flex };
    }

    // $FlowFixMe
    return React.createElement(
      TouchableWithoutFeedback,
      outerProps,
      React.createElement(
        View,
        props,
        ...Render.renderChildren(
          this.props.element,
          this.props.stylesheets,
          this.props.onUpdate,
          newOptions,
        ),
      ),
    );
  }
}
