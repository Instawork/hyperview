import { Animated, LayoutChangeEvent, Modal } from 'react-native';
import { Events, renderChildren } from 'hyperview';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { HvComponentProps } from 'hyperview';
import type { HvProps } from './types';
import Overlay from './Overlay';
import styles from './styles';

const namespace = 'https://hyperview.org/bottom-sheet';

const BottomSheet = (props: HvComponentProps) => {
  const animationDuration = props.element.getAttributeNS(
    namespace,
    'animation-duration',
  );
  const hvProps: HvProps = {
    animationDuration: animationDuration
      ? parseInt(animationDuration, 10)
      : 250,
    dismissible:
      props.element.getAttributeNS(namespace, 'dismissible') !== 'false',
    toggleEventName: props.element.getAttributeNS(
      namespace,
      'toggle-event-name',
    ),
    visible: props.element.getAttributeNS(namespace, 'visible') === 'true',
  };

  const [visible, setVisible] = useState(hvProps.visible);
  const [height, setHeight] = useState(0);

  const translateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  const targetOpacity: number = styles.overlay.opacity ?? 1;

  const animateOpen = useCallback(() => {
    translateY.setValue(height);
    setVisible(true);
    Animated.timing(translateY, {
      duration: hvProps.animationDuration,
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.timing(overlayOpacity, {
      duration: hvProps.animationDuration,
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
  }, [
    hvProps.animationDuration,
    height,
    targetOpacity,
    contentOpacity,
    overlayOpacity,
    translateY,
  ]);

  const animateClose = useCallback(() => {
    Animated.timing(translateY, {
      duration: hvProps.animationDuration,
      toValue: height,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });
    Animated.timing(overlayOpacity, {
      duration: hvProps.animationDuration,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [hvProps.animationDuration, height, overlayOpacity, translateY]);

  useEffect(() => {
    setVisible(hvProps.visible);
  }, [hvProps.visible]);

  const onHyperviewEventDispatch = useCallback(
    (eventName: string) => {
      if (!hvProps.toggleEventName || eventName !== hvProps.toggleEventName) {
        return;
      }
      if (!visible) {
        animateOpen();
      } else {
        animateClose();
      }
    },
    [hvProps.toggleEventName, animateOpen, animateClose, visible],
  );

  useEffect(() => {
    Events.subscribe(onHyperviewEventDispatch);
    return () => {
      Events.unsubscribe(onHyperviewEventDispatch);
    };
  }, [onHyperviewEventDispatch, visible]);

  const children = renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );

  const content = (
    <Animated.View
      onLayout={onLayout}
      style={[
        styles.wrapper,
        { opacity: contentOpacity, transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );

  if (height === 0) {
    // Pre-render the content to trigger the layout calculation
    // The content should not be visible as we start with an opacity of 0
    return content;
  }

  return (
    <Modal onShow={animateOpen} transparent visible={visible}>
      <Overlay
        onPress={() => hvProps.dismissible && animateClose()}
        style={[styles.overlay, { opacity: overlayOpacity }]}
      />
      {content}
    </Modal>
  );
};

BottomSheet.localName = 'bottom-sheet';

BottomSheet.namespaceURI = namespace;

export { BottomSheet };
