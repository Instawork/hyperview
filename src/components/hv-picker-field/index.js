// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import {
  Modal,
  Picker,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { Props, State } from './types';
import React, { PureComponent } from 'react';
import { createProps, createStyleProp } from 'hyperview/src/services';
import type { DOMString } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';

export default class HvPickerField extends PureComponent<Props, State> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.PICKER_FIELD;
  props: Props;
  state: State = {
    value: null,
    label: null,
    pickerValue: null,
    showPicker: false,
    fieldPressed: false,
    savePressed: false,
    cancelPressed: false,
  };

  constructor(props: Props) {
    const { element } = props;
    super(props);
    const value = element.getAttribute('value');
    this.state.value = value;
    this.state.label = value ? this.getLabelForValue(value) : '';

    this.openPickerModal = this.openPickerModal.bind(this);
    this.cancelPickerModal = this.cancelPickerModal.bind(this);
    this.savePickerModal = this.savePickerModal.bind(this);
  }

  getLabelForValue = (value: DOMString): ?string => {
    const { element } = this.props;
    const elements = element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      LOCAL_NAME.PICKER_ITEM,
    );
    const item = Array.from(elements).find(
      e => e.getAttribute('value') === value,
    );
    return item ? item.getAttribute('label') : null;
  };

  openPickerModal = () => {
    this.setState({
      pickerValue: this.state.value,
      showPicker: true,
    });
  };

  cancelPickerModal = () => {
    this.setState({
      showPicker: false,
    });
  };

  savePickerModal = () => {
    const { element } = this.props;
    this.setState({
      showPicker: false,
      value: this.state.pickerValue,
    });
    element.setAttribute('value', this.state.pickerValue || '');
  };

  renderPicker = () => {
    const { element } = this.props;
    const props = {
      onValueChange: value => {
        this.setState({ pickerValue: value });
      },
      selectedValue: this.state.pickerValue,
    };

    const children = Array.from(
      element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    ).map(item => {
      if (!item) {
        return null;
      }
      const label = item.getAttribute('label');
      const value = item.getAttribute('value');
      if (!label || !value) {
        return null;
      }
      return React.createElement(Picker.Item, { label, value });
    });

    return React.createElement(Picker, props, ...children);
  };

  renderPickerModal = () => {
    const { element, stylesheets, options } = this.props;
    const modalStyle = createStyleProp(element, stylesheets, {
      ...options,
      styleAttr: 'modal-style',
    });
    const cancelTextStyle = createStyleProp(element, stylesheets, {
      ...options,
      pressed: this.state.cancelPressed,
      styleAttr: 'modal-text-style',
    });
    const saveTextStyle = createStyleProp(element, stylesheets, {
      ...options,
      pressed: this.state.savePressed,
      styleAttr: 'modal-text-style',
    });
    const cancelLabel = element.getAttribute('cancel-label') || 'Cancel';
    const saveLabel = element.getAttribute('save-label') || 'Save';

    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.showPicker}
        onRequestClose={this.cancelPickerModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <View style={modalStyle}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableWithoutFeedback
                onPressIn={() => this.setState({ cancelPressed: true })}
                onPressOut={() => this.setState({ cancelPressed: false })}
                onPress={this.cancelPickerModal}
              >
                <Text style={cancelTextStyle}>{cancelLabel}</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={() => this.setState({ savePressed: true })}
                onPressOut={() => this.setState({ savePressed: false })}
                onPress={this.savePickerModal}
              >
                <Text style={saveTextStyle}>{saveLabel}</Text>
              </TouchableWithoutFeedback>
            </View>
            {this.renderPicker()}
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    const { element, stylesheets, options } = this.props;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const focused = this.state.showPicker;
    const pressed = this.state.fieldPressed;
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
    const value = element.getAttribute('value');
    const placeholderTextColor = element.getAttribute('placeholderTextColor');

    if (!value && placeholderTextColor) {
      fieldTextStyle.push({ color: placeholderTextColor });
    }

    const label = value
      ? this.getLabelForValue(value) || value
      : element.getAttribute('placeholder') || '';

    return (
      <TouchableWithoutFeedback
        onPressIn={() => this.setState({ fieldPressed: true })}
        onPressOut={() => this.setState({ fieldPressed: false })}
        onPress={this.openPickerModal}
      >
        <View {...props}>
          <Text style={fieldTextStyle}>{label}</Text>
          {this.renderPickerModal()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
