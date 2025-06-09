import {
  Animated,
  LayoutChangeEvent,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ModalButton from './modal-button';
import Overlay from './overlay';
import type { Props } from './types';
import type { StyleSheet as StyleSheetType } from 'hyperview/src/types';
import styles from './styles';
import { useStyleProp } from 'hyperview/src/services';

/**
 * Renders a bottom sheet with cancel/done buttons and a picker component.
 * Uses styles defined on the <picker-field> element for the modal and buttons.
 * This is used on iOS only.
 */
export default (props: Props): JSX.Element => {
  // eslint-disable-next-line react/destructuring-assignment
  const {
    children,
    element,
    focused: propsFocused,
    onModalCancel,
    onModalDone,
    options,
    stylesheets,
  } = props;
  const { focused, pressed, pressedSelected, selected } = options;
  const [visible, setVisible] = useState(propsFocused);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setVisible(propsFocused);
  }, [propsFocused]);

  const translateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const style: Array<StyleSheetType> = useStyleProp(element, stylesheets, {
    ...options,
    styleAttr: 'modal-style',
  });

  const cancelLabel: string = element.getAttribute('cancel-label') || 'Cancel';
  const doneLabel: string = element.getAttribute('done-label') || 'Done';

  const overlayStyle = StyleSheet.flatten(
    useStyleProp(element, stylesheets, {
      ...options,
      styleAttr: 'modal-overlay-style',
    }),
  );

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  const getDuration = (attribute: string, defaultValue: number) => {
    const value = parseInt(element.getAttribute(attribute) || '', 10);
    return Number.isNaN(value) || value < 0 ? defaultValue : value;
  };

  const animationDuration: number = getDuration(
    'modal-animation-duration',
    250,
  );
  const overlayAnimationDuration: number = getDuration(
    'modal-overlay-animation-duration',
    animationDuration,
  );
  const dismissAnimationDuration: number = getDuration(
    'modal-dismiss-animation-duration',
    animationDuration,
  );
  const dismissOverlayAnimationDuration: number = getDuration(
    'modal-dismiss-overlay-animation-duration',
    overlayAnimationDuration,
  );

  const targetOpacity: number = overlayStyle?.opacity ?? 1;

  const animateOpen = () => () => {
    translateY.setValue(height);
    Animated.timing(translateY, {
      duration: animationDuration,
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.timing(overlayOpacity, {
      duration: overlayAnimationDuration,
      toValue: targetOpacity,
      useNativeDriver: true,
    }).start();
    // We start with a 0 opacity to avoid a flash of the content
    // before the animation starts, that occurs because `onLayout`
    // is called before `onShow`
    Animated.timing(contentOpacity, {
      duration: 1,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animateClose = (callback: () => void) => () => {
    Animated.timing(translateY, {
      duration: dismissAnimationDuration,
      toValue: height,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setVisible(false);
        callback();
      }
    });
    Animated.timing(overlayOpacity, {
      duration: dismissOverlayAnimationDuration,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const onShow = animateOpen();
  const onDismiss = animateClose(onModalCancel);
  const onDone = animateClose(onModalDone);

  return (
    <Modal
      onRequestClose={onModalCancel}
      onShow={onShow}
      transparent
      visible={visible}
    >
      <Overlay
        onPress={onDismiss}
        style={[overlayStyle, { opacity: overlayOpacity }]}
      />
      <Animated.View
        onLayout={onLayout}
        style={[
          styles.wrapper,
          { opacity: contentOpacity, transform: [{ translateY }] },
        ]}
      >
        <View style={style}>
          <View style={styles.actions}>
            <ModalButton
              element={element}
              label={cancelLabel}
              onPress={onDismiss}
              options={options}
              stylesheets={stylesheets}
            />
            <ModalButton
              element={element}
              label={doneLabel}
              onPress={onDone}
              options={options}
              stylesheets={stylesheets}
            />
          </View>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

export * from './types';
