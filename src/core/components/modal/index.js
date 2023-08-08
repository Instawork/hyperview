// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Animated, Modal, View } from 'react-native';
import React, { useRef, useState } from 'react';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import ModalButton from './modal-button';
import type { Node } from 'react';
import Overlay from './overlay';
import type { Props } from './types';
import type { StyleSheet } from 'hyperview/src/types';
import { createStyleProp } from 'hyperview/src/services';
import styles from './styles';

/**
 * Renders a bottom sheet with cancel/done buttons and a picker component.
 * Uses styles defined on the <picker-field> element for the modal and buttons.
 * This is used on iOS only.
 */
export default (props: Props): Node => {
  const [visible, setVisible] = useState(props.isFocused());
  const [height, setHeight] = useState(0);

  const translateY = useRef(new Animated.Value(0)).current;
  const style: Array<StyleSheet> = createStyleProp(
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

  const overlayStyle: Array<StyleSheet> = createStyleProp(
    props.element,
    props.stylesheets,
    {
      ...props.options,
      styleAttr: 'modal-overlay-style',
    },
  );

  const onLayout = (event: LayoutEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  const animationDuration: number =
    parseInt(props.element.getAttribute('modal-animation-duration'), 10) || 250;

  const animate = (
    fromValue: number,
    toValue: number,
    callback?: ({ finished: boolean }) => void,
  ) => () => {
    translateY.setValue(fromValue);
    Animated.timing(translateY, {
      duration: animationDuration,
      toValue,
      useNativeDriver: true,
    }).start(callback);
  };

  const onShow = animate(height, 0);

  const onDismiss = animate(0, height, ({ finished }) => {
    if (finished) {
      setVisible(false);
      props.onModalCancel();
    }
  });

  const onDone = animate(0, height, ({ finished }) => {
    if (finished) {
      setVisible(false);
      props.onModalDone();
    }
  });

  return (
    <Modal
      onRequestClose={props.onModalCancel}
      onShow={onShow}
      transparent
      visible={visible}
    >
      <Overlay onPress={onDismiss} style={overlayStyle} />
      <Animated.View
        onLayout={onLayout}
        style={[styles.wrapper, { transform: [{ translateY }] }]}
      >
        <View style={style}>
          <View style={styles.actions}>
            <ModalButton
              getStyle={getTextStyle}
              label={cancelLabel}
              onPress={onDismiss}
            />
            <ModalButton
              getStyle={getTextStyle}
              label={doneLabel}
              onPress={onDone}
            />
          </View>
          {props.children}
        </View>
      </Animated.View>
    </Modal>
  );
};
