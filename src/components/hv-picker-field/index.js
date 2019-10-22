// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  Element,
  HvComponentOptions,
  NodeList,
  StyleSheets,
} from 'hyperview/src/types';
import {
  Modal,
  Picker,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { createProps, createStyleProp } from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Node as ReactNode } from 'react';
import type { StyleSheet as StyleSheetType } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import styles from './styles';

/**
 * A picker field renders a form field with values that come from a pre-defined list.
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, the system picker is rendered inline on the screen. Pressing the picker
 *   opens a system dialog.
 */
export default class HvPickerField extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.PICKER_FIELD;
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    const element: Element = props.element;
    const value: ?DOMString = element.getAttribute('value');
    this.state = {
      // on iOS, value is used to display the selected choice when
      // the picker modal is hidden
      value,
      // on iOS, pickerValue is used to display the selected choice
      // in the picker modal. On Android, the picker is shown in-line on the screen,
      // so this value gets displayed.
      pickerValue: value,
      focused: false,
      fieldPressed: false,
      donePressed: false,
      cancelPressed: false,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const value = nextProps.element.getAttribute('value') || '';
    return value !== prevState.value ? { value } : {};
  }

  toggleFieldPress = () => {
    this.setState({ fieldPressed: !this.state.fieldPressed });
  };

  toggleCancelPress = () => {
    this.setState({ cancelPressed: !this.state.cancelPressed });
  };

  toggleSavePress = () => {
    this.setState({ donePressed: !this.state.donePressed });
  };

  /**
   * Gets the label from the picker items for the given value.
   * If the value doesn't have a picker item, returns null.
   */
  getLabelForValue = (value: DOMString): ?string => {
    const element: Element = this.props.element;
    const pickerItemElements: NodeList<Element> = element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      LOCAL_NAME.PICKER_ITEM,
    );

    let item: ?Element = null;
    for (let i = 0; i < pickerItemElements.length; i += 1) {
      const pickerItemElement: ?Element = pickerItemElements.item(i);
      if (
        pickerItemElement &&
        pickerItemElement.getAttribute('value') === value
      ) {
        item = pickerItemElement;
        break;
      }
    }
    return item ? item.getAttribute('label') : null;
  };

  /**
   * Shows the picker, defaulting to the field's value.
   */
  onFieldPress = () => {
    this.setState({
      pickerValue: this.state.value,
      focused: true,
    });
  };

  /**
   * Hides the picker without applying the chosen value.
   */
  onModalCancel = () => {
    this.setState({
      focused: false,
    });
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  onModalDone = () => {
    const element: Element = this.props.element;
    this.setState({
      focused: false,
      value: this.state.pickerValue,
    });
    element.setAttribute('value', this.state.pickerValue || '');
  };

  /**
   * Renders the picker component. Picker items come from the
   * <picker-item> elements in the <picker-field> element.
   */
  renderPicker = (style: StyleSheetType<*>): ReactNode => {
    const element: Element = this.props.element;
    const props = {
      onValueChange: value => {
        this.setState({ pickerValue: value });
      },
      selectedValue: this.state.pickerValue,
      style,
    };

    // Gets all of the <picker-item> elements. All picker item elements
    // with a value and label are turned into options for the picker.
    const children: Array<ReactNode> = Array.from(
      element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    )
      .filter(Boolean)
      .map((item: Element) => {
        const label: ?DOMString = item.getAttribute('label');
        const value: ?DOMString = item.getAttribute('value');
        if (!label || value === null) {
          return null;
        }
        return React.createElement(Picker.Item, { label, value });
      });

    return React.createElement(Picker, props, ...children);
  };

  /**
   * Renders a bottom sheet with cancel/done buttons and a picker component.
   * Uses styles defined on the <picker-field> element for the modal and buttons.
   */
  renderPickerModal = (): ReactNode => {
    const element: Element = this.props.element;
    const stylesheets: StyleSheets = this.props.stylesheets;
    const options: HvComponentOptions = this.props.options;
    const modalStyle: Array<StyleSheetType<*>> = createStyleProp(
      element,
      stylesheets,
      {
        ...options,
        styleAttr: 'modal-style',
      },
    );
    const cancelTextStyle: Array<StyleSheetType<*>> = createStyleProp(
      element,
      stylesheets,
      {
        ...options,
        pressed: this.state.cancelPressed,
        styleAttr: 'modal-text-style',
      },
    );
    const doneTextStyle: Array<StyleSheetType<*>> = createStyleProp(
      element,
      stylesheets,
      {
        ...options,
        pressed: this.state.donePressed,
        styleAttr: 'modal-text-style',
      },
    );
    const cancelLabel: string =
      element.getAttribute('cancel-label') || 'Cancel';
    const doneLabel: string = element.getAttribute('done-label') || 'Done';

    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.focused}
        onRequestClose={this.onModalCancel}
      >
        <View style={styles.modalWrapper}>
          <View style={modalStyle}>
            <View style={styles.modalActions}>
              <TouchableWithoutFeedback
                onPressIn={this.toggleCancelPress}
                onPressOut={this.toggleCancelPress}
                onPress={this.onModalCancel}
              >
                <View>
                  <Text style={cancelTextStyle}>{cancelLabel}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={this.toggleSavePress}
                onPressOut={this.toggleSavePress}
                onPress={this.onModalDone}
              >
                <View>
                  <Text style={doneTextStyle}>{doneLabel}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            {this.renderPicker()}
          </View>
        </View>
      </Modal>
    );
  };

  /**
   * On Android, we render a view containing the system picker. Android's system picker opens a modal
   * when pressed so the user can select an option. The selected option gets applied immediately. The user
   * can cancel by hitting the back button or tapping outside of the modal.
   */
  renderAndroid = (): ReactNode => {
    const element: Element = this.props.element;
    const stylesheets: StyleSheets = this.props.stylesheets;
    const options: HvComponentOptions = this.props.options;
    const fieldStyle: StyleSheetType<*> = createStyleProp(
      element,
      stylesheets,
      {
        ...options,
        styleAttr: 'field-style',
      },
    );
    const textStyle: StyleSheetType<*> = createStyleProp(element, stylesheets, {
      ...options,
      styleAttr: 'field-text-style',
    });
    const pickerComponent = this.renderPicker(textStyle);
    return <View style={fieldStyle}>{pickerComponent}</View>;
  };

  /**
   * On iOS, we render a view containing a text label. Pressing the view opens a modal with a system picker and
   * action buttons along the bottom of the screen. After selecting an option, the user must press the save button.
   * To cancel, the user must press the cancel button.
   */
  renderiOS = (): ReactNode => {
    const element: Element = this.props.element;
    const stylesheets: StyleSheets = this.props.stylesheets;
    const options: HvComponentOptions = this.props.options;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused: boolean = this.state.focused;
    const pressed: boolean = this.state.fieldPressed;
    const props = createProps(element, stylesheets, {
      ...options,
      focused,
      pressed,
      styleAttr: 'field-style',
    });
    const fieldTextStyle = createStyleProp(element, stylesheets, {
      ...options,
      focused,
      pressed,
      styleAttr: 'field-text-style',
    });
    const value: ?DOMString = element.getAttribute('value');
    const placeholderTextColor: ?DOMString = element.getAttribute(
      'placeholderTextColor',
    );
    if (!value && placeholderTextColor) {
      fieldTextStyle.push({ color: placeholderTextColor });
    }

    const label: string = value
      ? this.getLabelForValue(value) || value
      : element.getAttribute('placeholder') || '';

    return (
      <TouchableWithoutFeedback
        onPressIn={this.toggleFieldPress}
        onPressOut={this.toggleFieldPress}
        onPress={this.onFieldPress}
      >
        <View {...props}>
          <Text style={fieldTextStyle}>{label}</Text>
          {this.renderPickerModal()}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render(): ReactNode {
    return Platform.OS === 'ios' ? this.renderiOS() : this.renderAndroid();
  }
}
