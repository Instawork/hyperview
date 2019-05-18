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
import React, { PureComponent } from 'react';
import type { DOMString } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Props } from './types';
import { View, Modal, Picker, Text, TouchableOpacity } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvPickerField extends PureComponent<Props> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.PICKER_FIELD;
  state: {
    value: '',
    label: '',
    pickerValue: '',
    showPicker: false,
  };

  constructor(props: Props) {
    const { element } = props;
    super(props);
    this.state = {
      value: element.getAttribute('value') || '',
      pickerValue: element.getAttribute('value') || '',
    };

    this.openPickerModal = this.openPickerModal.bind(this);
    this.cancelPickerModal = this.cancelPickerModal.bind(this);
    this.savePickerModal = this.savePickerModal.bind(this);
  }

  openPickerModal = () => {
    this.setState({
      pickerValue: this.state.value,
      showPicker: true,
    });
  };

  cancelPickerModal = () => {
    console.log('cancel modal');
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
    element.setAttribute('value', this.state.pickerValue);
  };

  renderPicker() {
    const { element } = this.props;
    const props = {
      onValueChange: (value, index) => {
        this.setState({ pickerValue: value });
      },
      selectedValue: this.state.pickerValue,
    };

    const children = Array.from(
      element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    ).map(item =>
      React.createElement(Picker.Item, {
        label: item.getAttribute('label'),
        value: item.getAttribute('value'),
      }),
    );

    return React.createElement(Picker, props, ...children);
  }

  renderPickerModal() {
    const picker = this.renderPicker();
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showPicker}
        onRequestClose={this.cancelPickerModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              background: 'white',
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            <Text onPress={this.cancelPickerModal}>Cancel</Text>
            <Text onPress={this.savePickerModal}>Done</Text>
          </View>
          {picker}
        </View>
      </Modal>
    );
  }

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    if (element.getAttribute('hide') === 'true') {
      return null;
    }

    const props = {
      ...createProps(element, stylesheets, options),
    };

    const placeholder =
      element.getAttribute('placeholder') || 'Select an option';
    const label = element.getAttribute('value') || placeholder;

    return (
      <TouchableOpacity onPress={this.openPickerModal}>
        <View {...props}>
          <Text>{label}</Text>
          {this.renderPickerModal()}
        </View>
      </TouchableOpacity>
    );
  }
}
