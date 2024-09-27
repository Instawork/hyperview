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
import { createStyleProp } from 'hyperview/src/services';
import styles from './styles';

/**
 * Renders a bottom sheet with cancel/done buttons and a picker component.
 * Uses styles defined on the <picker-field> element for the modal and buttons.
 * This is used on iOS only.
 */
export default (props: Props): JSX.Element => {
  const [visible, setVisible] = useState(props.focused);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setVisible(props.focused);
  }, [props.focused]);

  const translateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const style: Array<StyleSheetType> = createStyleProp(
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

  const getTextStyle = (pressed: boolean): Array<StyleSheetType> =>
    createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      pressed,
      styleAttr: 'modal-text-style',
    });

  const overlayStyle = StyleSheet.flatten(
    createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      styleAttr: 'modal-overlay-style',
    }),
  );

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  const getDuration = (attribute: string, defaultValue: number) => {
    const value = parseInt(props.element.getAttribute(attribute) || '', 10);
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
  const onDismiss = animateClose(props.onModalCancel);
  const onDone = animateClose(props.onModalDone);

  return (
    <Modal
      onRequestClose={props.onModalCancel}
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

export * from './types';
