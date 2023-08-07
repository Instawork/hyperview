// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Modal, View } from 'react-native';
import ModalButton from '../modal-button';
import type { Node } from 'react';
import type { Props } from './types';
import React from 'react';
import type { StyleSheet } from 'hyperview/src/types';
import { createStyleProp } from 'hyperview/src/services';
import styles from './styles';

/**
 * Renders a bottom sheet with cancel/done buttons and a picker component.
 * Uses styles defined on the <picker-field> element for the modal and buttons.
 * This is used on iOS only.
 */
export default (props: Props): Node => {
  const modalStyle: Array<StyleSheet> = createStyleProp(
    props.element,
    props.stylesheets,
    {
      ...props.options,
      styleAttr: 'modal-style',
    },
  );

  const cancelLabel: string =
    props.element.getAttribute('cancel-label') || 'Cancel';
  const doneLabel: string = props.element.getAttribute('done-label') || 'Done';

  const getTextStyle = (pressed: boolean): Array<StyleSheet> =>
    createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      pressed,
      styleAttr: 'modal-text-style',
    });

  const onChange = (evt: Event, date?: Date) => {
    props.setPickerValue(date);
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={props.onModalCancel}
      transparent
      visible={props.isFocused()}
    >
      <View style={styles.modalWrapper}>
        <View style={modalStyle}>
          <View style={styles.modalActions}>
            <ModalButton
              getStyle={getTextStyle}
              label={cancelLabel}
              onPress={props.onModalCancel}
            />
            <ModalButton
              getStyle={getTextStyle}
              label={doneLabel}
              onPress={() => props.onModalDone(props.getPickerValue())}
            />
          </View>
          <props.PickerComponent onChange={onChange} />
        </View>
      </View>
    </Modal>
  );
};
