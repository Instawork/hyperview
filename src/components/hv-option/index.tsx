import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
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

    // Updates options with pressed/selected state, so that child element can render
    // using the appropriate modifier styles.
    const newOptions = {
      ...this.props.options,
      pressed: this.state.pressed,
      pressedSelected: this.state.pressed && selected,
      selected,
    } as const;
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
      style: {},
    };
    if (props.style && props.style.flex) {
      // Flex is a style that needs to be lifted from the inner component to the outer
      // component to ensure proper layout.
      outerProps.style = { flex: props.style.flex };
    }

    // TODO: Replace with <HvChildren>
    return React.createElement(
      TouchableWithoutFeedback,
      outerProps,
      React.createElement(
        View,
        props,
        ...Render.renderChildren(
          this.props.element,
          this.props.stylesheets,
          this.props.onUpdate as HvComponentOnUpdate,
          newOptions,
        ),
      ),
    );
  }
}
