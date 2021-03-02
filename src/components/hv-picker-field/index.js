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
  HvComponentProps,
  NodeList,
  StyleSheet as StyleSheetType,
} from 'hyperview/src/types';
import {
  Modal,
  Picker,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import {
  createProps,
  createStyleProp,
  createTestProps,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Node as ReactNode } from 'react';
import type { State } from './types';
import styles from './styles';

/**
 * A picker field renders a form field with values that come from a pre-defined list.
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, the system picker is rendered inline on the screen. Pressing the picker
 *   opens a system dialog.
 */
export default class HvPickerField extends PureComponent<
  HvComponentProps,
  State,
> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.PICKER_FIELD;

  static localNameAliases = [];

  props: HvComponentProps;

  state: State;

  constructor(props: HvComponentProps) {
    super(props);
    const { element } = props;
    const value: ?DOMString = element.getAttribute('value');
    this.state = {
      cancelPressed: false,
      donePressed: false,
      fieldPressed: false,
      focused: false,
      // on iOS, pickerValue is used to display the selected choice
      // in the picker modal. On Android, the picker is shown in-line on the screen,
      // so this value gets displayed.
      pickerValue: value,
      // on iOS, value is used to display the selected choice when
      // the picker modal is hidden
      value,
    };
  }

  static getDerivedStateFromProps(
    nextProps: HvComponentProps,
    prevState: State,
  ) {
    const value = nextProps.element.getAttribute('value') || '';
    return value !== prevState.value ? { value } : {};
  }

  toggleFieldPress = () => {
    this.setState(state => ({
      ...state,
      fieldPressed: !state.fieldPressed,
    }));
  };

  toggleCancelPress = () => {
    this.setState(state => ({
      ...state,
      cancelPressed: !state.cancelPressed,
    }));
  };

  toggleSavePress = () => {
    this.setState(state => ({
      ...state,
      donePressed: !state.donePressed,
    }));
  };

  /**
   * Gets the label from the picker items for the given value.
   * If the value doesn't have a picker item, returns null.
   */
  getLabelForValue = (value: DOMString): ?string => {
    const pickerItemElements: NodeList<Element> = this.props.element.getElementsByTagNameNS(
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
    this.setState(state => ({
      ...state,
      focused: true,
      pickerValue: state.value,
    }));
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
    this.setState(state => ({
      ...state,
      focused: false,
      value: state.pickerValue,
    }));
    this.props.element.setAttribute('value', this.state.pickerValue || '');
  };

  /**
   * Renders the picker component. Picker items come from the
   * <picker-item> elements in the <picker-field> element.
   */
  renderPicker = (style: StyleSheetType): ReactNode => {
    const props = {
      onValueChange: (value: any) => {
        this.setState({ pickerValue: value });
        this.props.element.setAttribute('value', value || '');
      },
      selectedValue: this.state.pickerValue,
      style,
    };

    // Gets all of the <picker-item> elements. All picker item elements
    // with a value and label are turned into options for the picker.
    const children: Array<ReactNode> = Array.from(
      this.props.element.getElementsByTagNameNS(
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
    const modalStyle: Array<StyleSheetType> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'modal-style',
      },
    );
    const cancelTextStyle: Array<StyleSheetType> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        pressed: this.state.cancelPressed,
        styleAttr: 'modal-text-style',
      },
    );
    const doneTextStyle: Array<StyleSheetType> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        pressed: this.state.donePressed,
        styleAttr: 'modal-text-style',
      },
    );
    const cancelLabel: string =
      this.props.element.getAttribute('cancel-label') || 'Cancel';
    const doneLabel: string =
      this.props.element.getAttribute('done-label') || 'Done';

    return (
      <Modal
        animationType="slide"
        onRequestClose={this.onModalCancel}
        transparent
        visible={this.state.focused}
      >
        <View style={styles.modalWrapper}>
          <View style={modalStyle}>
            <View style={styles.modalActions}>
              <TouchableWithoutFeedback
                onPress={this.onModalCancel}
                onPressIn={this.toggleCancelPress}
                onPressOut={this.toggleCancelPress}
              >
                <View>
                  <Text style={cancelTextStyle}>{cancelLabel}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={this.onModalDone}
                onPressIn={this.toggleSavePress}
                onPressOut={this.toggleSavePress}
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
    const fieldStyle: StyleSheetType = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'field-style',
      },
    );

    const textStyle: StyleSheetType = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'field-text-style',
      },
    );
    const { testID, accessibilityLabel } = createTestProps(this.props.element);
    const value: ?DOMString = this.props.element.getAttribute('value');
    const placeholderTextColor: ?DOMString = this.props.element.getAttribute(
      'placeholderTextColor',
    );
    if (!value && placeholderTextColor) {
      textStyle.push({ color: placeholderTextColor });
    }

    const pickerComponent = this.renderPicker(textStyle);
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={fieldStyle}
        testID={testID}
      >
        {pickerComponent}
      </View>
    );
  };

  /**
   * On iOS, we render a view containing a text label. Pressing the view opens a modal with a system picker and
   * action buttons along the bottom of the screen. After selecting an option, the user must press the save button.
   * To cancel, the user must press the cancel button.
   */
  renderiOS = (): ReactNode => {
    if (this.props.element.getAttribute('hide') === 'true') {
      return null;
    }

    const pressed: boolean = this.state.fieldPressed;
    const props = createProps(this.props.element, this.props.stylesheets, {
      ...this.props.options,
      focused: this.state.focused,
      pressed,
      styleAttr: 'field-style',
    });
    const fieldTextStyle = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        focused: this.state.focused,
        pressed,
        styleAttr: 'field-text-style',
      },
    );
    const value: ?DOMString = this.props.element.getAttribute('value');
    const placeholderTextColor: ?DOMString = this.props.element.getAttribute(
      'placeholderTextColor',
    );
    if (!value && placeholderTextColor) {
      fieldTextStyle.push({ color: placeholderTextColor });
    }

    const label: string = value
      ? this.getLabelForValue(value) || value
      : this.props.element.getAttribute('placeholder') || '';

    return (
      <TouchableWithoutFeedback
        onPress={this.onFieldPress}
        onPressIn={this.toggleFieldPress}
        onPressOut={this.toggleFieldPress}
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
