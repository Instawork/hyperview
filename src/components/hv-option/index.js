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
      this.triggerSelectBehaviors();
    }

    if (!selected && prevSelected) {
      this.triggerDeselectBehaviors();
    }
  }

  triggerSelectBehaviors = () => {
    const behaviorElements = Dom.getBehaviorElements(this.props.element);
    const selectBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'select',
    );
    selectBehaviors.forEach(behaviorElement => {
      const href = behaviorElement.getAttribute('href');
      const action = behaviorElement.getAttribute('action');
      const verb = behaviorElement.getAttribute('verb');
      const targetId = behaviorElement.getAttribute('target');
      const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
      const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
      const delay = behaviorElement.getAttribute('delay');
      const once = behaviorElement.getAttribute('once');
      this.props.onUpdate(href, action, this.props.element, {
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

  triggerDeselectBehaviors = () => {
    const behaviorElements = Dom.getBehaviorElements(this.props.element);
    const deselectBehaviors = behaviorElements.filter(
      e => e.getAttribute('trigger') === 'deselect',
    );
    deselectBehaviors.forEach(behaviorElement => {
      const href = behaviorElement.getAttribute('href');
      const action = behaviorElement.getAttribute('action');
      const verb = behaviorElement.getAttribute('verb');
      const targetId = behaviorElement.getAttribute('target');
      const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
      const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
      const delay = behaviorElement.getAttribute('delay');
      const once = behaviorElement.getAttribute('once');
      this.props.onUpdate(href, action, this.props.element, {
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

  render() {
    const { onSelect, onToggle } = this.props.options;

    const value = this.props.element.getAttribute('value');
    const selected = this.props.element.getAttribute('selected') === 'true';

    // Updates options with pressed/selected state, so that child element can render
    // using the appropriate modifier styles.
    const newOptions = {
      ...this.props.options,
      pressed: this.state.pressed,
      pressedSelected: this.state.pressed && selected,
      selected,
    };
    const props = createProps(
      this.props.element,
      this.props.stylesheets,
      newOptions,
    );

    // Option renders as an outer TouchableWithoutFeedback view and inner view.
    // The outer view handles presses, the inner view handles styling.
    const outerProps = {
      onPress: createEventHandler(() => {
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
      }, true),
      onPressIn: createEventHandler(() => this.setState({ pressed: true })),
      onPressOut: createEventHandler(() => this.setState({ pressed: false })),
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
