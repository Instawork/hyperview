import { Dimensions, LayoutChangeEvent, Modal, View } from 'react-native';
import type { HvComponentProps, LocalName } from 'hyperview';
import Hyperview, { Events } from 'hyperview';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { HvProps } from './types';
import Overlay from './Overlay';
import styles from './styles';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BottomSheetContentSection } from './BottomSheetContentSection';
import { BottomSheetStopPoint } from './BottomSheetStopPoint';
import { Context as BottomSheetContext } from '../../Contexts/BottomSheet';

const namespace = 'https://hyperview.org/bottom-sheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PADDING = 50;
const MAX_TRANSLATE_Y = -(SCREEN_HEIGHT - PADDING);

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

    swipeToClose:
      props.element.getAttributeNS(namespace, 'swipe-to-close') === 'true',
    contentSections: props.element.getElementsByTagNameNS(
      namespace,
      BottomSheetContentSection.localName,
    ),
    stopPoints: props.element.getElementsByTagNameNS(
      namespace,
      BottomSheetStopPoint.localName,
    ),
  };

  const [contentSectionHeights, setContentSectionHeights] = useState(
    new Array(hvProps.contentSections.length),
  );

  const stopPointLocations = React.useMemo(() => {
    return Array.from(hvProps.stopPoints)
      .map<number | null>(element => {
        return typeof element !== 'string' &&
          element &&
          element.getAttribute &&
          element.getAttribute('location') &&
          typeof element.getAttribute('location') === 'string'
          ? parseFloat(element.getAttribute('location'))
          : null;
      }, [])
      .sort((a, b) => {
        if (a !== null && b !== null) {
          return a - b;
        }
        return 0;
      });
  }, [hvProps.stopPoints]);

  const [visible, setVisible] = useState(hvProps.visible);
  const [height, setHeight] = useState(0);

  const overlayOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const translateY = useSharedValue(0);

  const scrollTo = useCallback(
    (destination: number) => {
      'worklet';

      translateY.value = withSpring(destination, { damping: 50 });
    },
    [translateY],
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const { height: sheetHeight } = event.nativeEvent.layout;
    setHeight(sheetHeight);
    if (hvProps.contentSections.length > 0) {
      // scroll to height of first content section
      if (contentSectionHeights[0] !== undefined) {
        scrollTo(-contentSectionHeights[0] - PADDING);
      } else {
        scrollTo(-sheetHeight - PADDING);
      }
    } else if (hvProps.stopPoints.length > 0) {
      scrollTo(-SCREEN_HEIGHT * stopPointLocations[0]);
    } else {
      scrollTo(-sheetHeight - PADDING);
    }
  };

  const targetOpacity: number = styles.overlay.opacity ?? 1;

  const animateOpen = useCallback(() => {
    setVisible(true);
    overlayOpacity.value = withTiming(targetOpacity, {
      duration: hvProps.animationDuration,
    });
    // We start with a 0 opacity to avoid a flash of the content
    // before the animation starts, that occurs because `onLayout`
    // is called before `onShow`
    contentOpacity.value = withTiming(1, { duration: 1 });
  }, [
    hvProps.animationDuration,
    targetOpacity,
    contentOpacity,
    overlayOpacity,
  ]);

  const animateClose = useCallback(() => {
    scrollTo(0);
    overlayOpacity.value = withTiming(0, {
      duration: hvProps.animationDuration,
    });
    setTimeout(() => setVisible(false), hvProps.animationDuration);
  }, [scrollTo, hvProps.animationDuration, overlayOpacity]);

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

  const childNodes = Array.from(props.element.childNodes).filter(
    n => (n as Element).tagName !== 'bottom-sheet:stop-point',
  );
  const children = Hyperview.renderChildNodes(
    childNodes,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );

  const findBottomSheetEndPoint = () => {
    'worklet';

    if (contentSectionHeights.length > 0) {
      let scrollToPoint = -1;
      let cumlSectionHeight = 0;
      contentSectionHeights.forEach(contentSectionHeight => {
        cumlSectionHeight += contentSectionHeight;
        if (Math.abs(translateY.value) < cumlSectionHeight) {
          if (scrollToPoint === -1) {
            scrollToPoint = cumlSectionHeight;
          }
        }
      });
      if (scrollToPoint === -1) {
        scrollToPoint = cumlSectionHeight;
      }
      scrollToPoint = Math.max(MAX_TRANSLATE_Y, -scrollToPoint - PADDING);
      scrollTo(scrollToPoint);
    } else if (stopPointLocations.length > 0) {
      const stopPointDiffs = stopPointLocations.map((stopPoint, index) => ({
        index,
        diff: Math.abs(stopPoint + translateY.value / SCREEN_HEIGHT),
      }));
      const closestStopPointIndex =
        stopPointDiffs.reduce(
          (min, current) => (current.diff < min.diff ? current : min),
          {
            index: -1,
            diff: Infinity,
          },
        )?.index ?? -1;
      if (closestStopPointIndex !== -1) {
        scrollTo(
          Math.max(
            -stopPointLocations[closestStopPointIndex] * SCREEN_HEIGHT,
            -height - PADDING,
          ),
        );
      }
    }
  };
  const gestureEnabled =
    hvProps.stopPoints.length > 0 || hvProps.contentSections.length > 0;
  const gesture = Gesture.Pan()
    .enabled(gestureEnabled)
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      findBottomSheetEndPoint();
    });

  const overlayStyle = useAnimatedStyle(() => {
    return { opacity: overlayOpacity.value };
  });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const content = (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          bottomSheetStyle,
          {
            height: SCREEN_HEIGHT,
            top: SCREEN_HEIGHT,
          },
        ]}
      >
        {gestureEnabled && <View style={styles.line} />}
        <View onLayout={onLayout}>{children}</View>
      </Animated.View>
    </GestureDetector>
  );

  if (height === 0) {
    // Pre-render the content to trigger the layout calculation
    // The content should not be visible as we start with an opacity of 0
    return content;
  }

  const setContentSectionHeight = (
    index: number,
    contentSectionHeight: number,
  ) => {
    const currentHeights = [...contentSectionHeights];
    currentHeights[index] = contentSectionHeight;
    setContentSectionHeights(currentHeights);
  };

  return (
    <BottomSheetContext.Provider value={{ setContentSectionHeight }}>
      <Modal onShow={animateOpen} transparent visible={visible}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Overlay
            onPress={() => {
              return hvProps.dismissible && animateClose();
            }}
            style={[styles.overlay, overlayStyle]}
          />
          {content}
        </GestureHandlerRootView>
      </Modal>
    </BottomSheetContext.Provider>
  );
};

BottomSheet.localName = 'bottom-sheet' as LocalName;

BottomSheet.localNameAliases = [] as LocalName[];

BottomSheet.namespaceURI = namespace;

export { BottomSheet };
