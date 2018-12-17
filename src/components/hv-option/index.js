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
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { createProps, getBehaviorElements } from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';

/**
 * A component representing an option in a single-select or multiple-select list.
 * Has a local pressed state. The selected state is read from the element attribute.
 */
export default class HvOption extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.OPTION;
  props: Props;
  state: State = {
    pressed: false,
  };

  componentDidUpdate(prevProps: Props) {
    const { element } = this.props;
    const prevElement = prevProps.element;
    const selected = element.getAttribute('selected') === 'true';
    const prevSelected = prevElement.getAttribute('selected') === 'true';
    if (selected && !prevSelected) {
      this.triggerSelectBehaviors();
    }

    if (!selected && prevSelected) {
      this.triggerDeselectBehaviors();
    }
  }

  triggerSelectBehaviors = () => {
    const { element, onUpdate } = this.props;
    const behaviorElements = getBehaviorElements(element);
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
      onUpdate(href, action, element, {
        verb,
        targetId,
        showIndicatorIds,
        hideIndicatorIds,
        delay,
        once,
        behaviorElement,
      });
    });
  };

  triggerDeselectBehaviors = () => {
    const { element, onUpdate } = this.props;
    const behaviorElements = getBehaviorElements(element);
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
      onUpdate(href, action, element, {
        verb,
        targetId,
        showIndicatorIds,
        hideIndicatorIds,
        delay,
        once,
        behaviorElement,
      });
    });
  };

  render() {
    const { element, stylesheets, animations, onUpdate, options } = this.props;
    const { pressed } = this.state;
    const { onSelect, onToggle } = options;

    const value = element.getAttribute('value');
    const selected = element.getAttribute('selected') === 'true';

    // Updates options with pressed/selected state, so that child element can render
    // using the appropriate modifier styles.
    const newOptions = {
      ...options,
      selected,
      pressed,
      pressedSelected: pressed && selected,
    };
    const props = createProps(element, stylesheets, animations, newOptions);

    // Option renders as an outer TouchableWithoutFeedback view and inner view.
    // The outer view handles presses, the inner view handles styling.
    const outerProps = {
      onPressIn: () => this.setState({ pressed: true }),
      onPressOut: () => this.setState({ pressed: false }),
      onPress: () => {
        if (!selected && onSelect) {
          // Updates the DOM state, causing this element to re-render as selected.
          // Used in select-single context.
          onSelect(value);
        }
        if (onToggle) {
          // Updates the DOM state, toggling this element.
          // Used in select-multiple context.
          onToggle(value);
        }
      },
      style: undefined,
    };
    if (props.style && props.style.flex) {
      // Flex is a style that needs to be lifted from the inner component to the outer
      // component to ensure proper layout.
      outerProps.style = { flex: props.style.flex };
    }

    return React.createElement(
      TouchableWithoutFeedback,
      outerProps,
      React.createElement(
        View,
        props,
        ...Render.renderChildren(
          element,
          stylesheets,
          animations,
          onUpdate,
          newOptions,
        ),
      ),
    );
  }
}
