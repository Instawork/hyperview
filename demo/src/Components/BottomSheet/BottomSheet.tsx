import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Dimensions, LayoutChangeEvent, Modal, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import type { HvComponentProps, LocalName } from 'hyperview';
import type { HvProps, HvStyles } from './types';
import Hyperview, { Events } from 'hyperview';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheetContentSection } from './BottomSheetContentSection';
import { Context as BottomSheetContext } from '../../Contexts/BottomSheet';
import { BottomSheetStopPoint } from './BottomSheetStopPoint';
import Overlay from './Overlay';
import { namespace } from './types';
import styles from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_DAMPING = 50;
const MIN_VELOCITY_FOR_MOVE = 0.01;
const SWIPE_TO_CLOSE_THRESHOLD = 0.1;

const BottomSheet = (props: HvComponentProps) => {
  const insets = useSafeAreaInsets();
  const PADDING = insets.top;
  const MAX_TRANSLATE_Y = -(SCREEN_HEIGHT - PADDING);

  const animationDuration = props.element.getAttributeNS(
    namespace,
    'animation-duration',
  );
  const hvProps: HvProps = {
    animationDuration: animationDuration
      ? parseInt(animationDuration, 10)
      : 250,
    contentSections: props.element.getElementsByTagNameNS(
      namespace,
      BottomSheetContentSection.localName,
    ),
    dismissible:
      props.element.getAttributeNS(namespace, 'dismissible') !== 'false',
    stopPoints: props.element.getElementsByTagNameNS(
      namespace,
      BottomSheetStopPoint.localName,
    ),
    swipeToClose:
      props.element.getAttributeNS(namespace, 'swipe-to-close') === 'true',
    toggleEventName: props.element.getAttributeNS(
      namespace,
      'toggle-event-name',
    ),
    visible: props.element.getAttributeNS(namespace, 'visible') === 'true',
  };
  const hvStyles: HvStyles = {
    bottomSheetBackgroundColor:
      Hyperview.createStyleProp(props.element, props.stylesheets, {
        ...props.options,
        styleAttr: 'bottom-sheet:container-style',
      })[0]?.backgroundColor || '#fff',
    handle: Hyperview.createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      styleAttr: 'bottom-sheet:handle-style',
    }),
    overlay: Hyperview.createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      styleAttr: 'bottom-sheet:overlay-style',
    }),
  };

  const [contentSectionHeights, setContentSectionHeights] = useState(
    new Array(hvProps.contentSections.length),
  );

  const stopPointLocations = React.useMemo(() => {
    return Array.from(hvProps.stopPoints)
      .map<number | null>(element => {
        const location = element.getAttributeNS(namespace, 'location');
        return typeof element !== 'string' &&
          element &&
          location &&
          typeof location === 'string'
          ? parseFloat(location)
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
  const context = useSharedValue({ startTime: Date.now(), y: 0 });
  const translateY = useSharedValue(0);
  const [upcomingTranslateY, setUpcomingTranslateY] = useState(0);
  const velocity = useSharedValue(0);
  const targetOpacity: number = hvStyles.overlay[0]?.opacity ?? 1;

  const hide = () => {
    setVisible(false);
  };

  const scrollTo = useCallback(
    (destination: number) => {
      'worklet';

      // reanimated takes time to set translateY value but
      // we need the new value to calculate whether innerView should scroll
      // so we use upcomingTranslateY to handle this case
      runOnJS(setUpcomingTranslateY)(destination);
      translateY.value = withSpring(destination, { damping: DEFAULT_DAMPING });
    },
    [translateY],
  );

  useEffect(() => {
    if (contentSectionHeights[0] !== undefined) {
      scrollTo(-contentSectionHeights[0] - PADDING);
    }
  }, [contentSectionHeights, scrollTo, PADDING]);

  const animateOpen = useCallback(() => {
    setVisible(true);
    if (hvProps.contentSections.length > 0) {
      // scroll to height of first content section
      if (contentSectionHeights[0] !== undefined) {
        scrollTo(-contentSectionHeights[0] - PADDING);
      }
    } else if (hvProps.stopPoints.length > 0) {
      const [firstStopPointLocation] = stopPointLocations;
      if (firstStopPointLocation !== null) {
        scrollTo(-SCREEN_HEIGHT * firstStopPointLocation);
      }
    } else {
      scrollTo(-height - PADDING);
    }
    overlayOpacity.value = withTiming(targetOpacity, {
      duration: hvProps.animationDuration,
    });
    // We start with a 0 opacity to avoid a flash of the content
    // before the animation starts, that occurs because `onLayout`
    // is called before `onShow`
    contentOpacity.value = withTiming(1, { duration: 1 });
  }, [
    height,
    contentSectionHeights,
    stopPointLocations,
    hvProps.animationDuration,
    targetOpacity,
    contentOpacity,
    overlayOpacity,
    hvProps.contentSections.length,
    hvProps.stopPoints.length,
    scrollTo,
    PADDING,
  ]);

  const animateClose = useCallback(() => {
    'worklet';

    scrollTo(0);
    overlayOpacity.value = withTiming(
      0,
      {
        duration: hvProps.animationDuration,
      },
      finished => {
        if (finished) {
          runOnJS(hide)();
        }
      },
    );
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

    const changeY = translateY.value + velocity.value * SCREEN_HEIGHT;

    if (
      hvProps.swipeToClose &&
      -changeY < SCREEN_HEIGHT * SWIPE_TO_CLOSE_THRESHOLD
    ) {
      animateClose();
      return;
    }

    if (contentSectionHeights.length > 0) {
      let cumlHeight = 0;
      contentSectionHeights.forEach((csHeight, index) => {
        cumlHeight += csHeight;
        stopPointLocations[index] = Math.min(cumlHeight / SCREEN_HEIGHT, 1.0);
      });
    }

    if (stopPointLocations.length > 0) {
      let nextStopPoint = -1;

      if (Math.abs(velocity.value) < MIN_VELOCITY_FOR_MOVE) {
        const stopPointDiffs = stopPointLocations.map((stopPoint, index) => ({
          diff: Math.abs(
            (stopPoint !== null ? stopPoint : 0) + changeY / SCREEN_HEIGHT,
          ),
          index,
        }));
        const closestStopPointIndex =
          stopPointDiffs.reduce(
            (min, current) => (current.diff < min.diff ? current : min),
            {
              diff: Infinity,
              index: -1,
            },
          )?.index ?? -1;
        if (closestStopPointIndex !== -1) {
          const stopPointLocation = stopPointLocations[closestStopPointIndex];
          if (stopPointLocation !== null) {
            scrollTo(
              Math.max(
                -stopPointLocation * SCREEN_HEIGHT - PADDING,
                -height - PADDING,
              ),
            );
          }
        }
      } else if (velocity.value < 0) {
        // Moving upwards, find the next stop point above
        for (let i = stopPointLocations.length - 1; i >= 0; i -= 1) {
          const stopPointLocation = stopPointLocations[i];
          if (stopPointLocation !== null) {
            const stopPointY = -SCREEN_HEIGHT * stopPointLocation;
            if (translateY.value > stopPointY) {
              nextStopPoint = stopPointLocation;
            }
          }
        }
        if (nextStopPoint === -1) {
          const stopPointLocation =
            stopPointLocations[stopPointLocations.length - 1];
          if (stopPointLocation !== null) {
            nextStopPoint = stopPointLocation;
          }
        }
      } else {
        // Moving downwards, find the next stop point below
        for (let i = 0; i < stopPointLocations.length; i += 1) {
          const stopPointLocation = stopPointLocations[i];
          if (stopPointLocation !== null) {
            const stopPoint = -SCREEN_HEIGHT * stopPointLocation;
            if (translateY.value < stopPoint) {
              nextStopPoint = stopPointLocation;
            }
          }
        }
        if (nextStopPoint === -1) {
          const [stopPointLocation] = stopPointLocations;
          if (stopPointLocation !== null) {
            nextStopPoint = stopPointLocation;
          }
        }
      }

      if (nextStopPoint > -1) {
        scrollTo(
          Math.max(
            MAX_TRANSLATE_Y,
            -nextStopPoint * SCREEN_HEIGHT - PADDING,
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
      context.value = { startTime: Date.now(), y: translateY.value };
    })
    .onUpdate(event => {
      const currentTime = Date.now();
      const timeDiff = currentTime - context.value.startTime;
      const yDiff = event.translationY + context.value.y - translateY.value;
      velocity.value = yDiff / timeDiff;

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

  const innerView = useMemo(() => {
    const onLayout = (event: LayoutChangeEvent) => {
      const { height: sheetHeight } = event.nativeEvent.layout;
      setHeight(sheetHeight);
    };

    return (
      <View
        onLayout={onLayout}
        onStartShouldSetResponder={() => {
          return upcomingTranslateY > MAX_TRANSLATE_Y;
        }}
      >
        <>{children}</>
      </View>
    );
  }, [upcomingTranslateY, children, MAX_TRANSLATE_Y]);

  const content = (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          bottomSheetStyle,
          {
            backgroundColor: hvStyles.bottomSheetBackgroundColor,
            height: SCREEN_HEIGHT,
            top: SCREEN_HEIGHT,
          },
        ]}
      >
        {gestureEnabled && <View style={hvStyles.handle} />}
        {innerView}
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
            style={[styles.overlay, hvStyles.overlay, overlayStyle]}
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
