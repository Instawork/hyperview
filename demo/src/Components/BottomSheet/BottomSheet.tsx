import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Dimensions,
  LayoutChangeEvent,
  Modal,
  Platform,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import type { HvComponentProps, LocalName } from 'hyperview';
import type { HvProps, HvStyles } from './types';
import Hyperview, { Events } from 'hyperview';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { dragDownHelper, dragUpHelper } from './utils';
import { BottomSheetContentSection } from './ContentSection';
import { Context as BottomSheetContext } from '../../Contexts/BottomSheet';
import { BottomSheetStopPoint } from './StopPoint';
import Overlay from './Overlay';
import { namespace } from './types';
import styles from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_ANIMATION_DURATION = 200;
const DEFAULT_DAMPING_MULTIPLIER = 0.1;
const MIN_DAMPING = 15;
const DEFAULT_PADDING_ANDROID = 10;
const MIN_VELOCITY_FOR_MOVE = 0.01;
const SWIPE_TO_CLOSE_THRESHOLD = 0.1;

const BottomSheet = (props: HvComponentProps) => {
  const insets = useSafeAreaInsets();
  const topOffset = Platform.select({
    default: 0,
    ios: insets.top,
  });
  const MAX_TRANSLATE_Y = -(SCREEN_HEIGHT - topOffset);

  const animationDuration = props.element.getAttributeNS(
    namespace,
    'animation-duration',
  );
  const hvProps: HvProps = {
    animationDuration: animationDuration
      ? parseInt(animationDuration, 10)
      : DEFAULT_ANIMATION_DURATION,
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
  const { prefix } = props.element;
  const hvStyles: HvStyles = {
    container: Hyperview.createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      styleAttr: `${prefix}:container-style`,
    }),
    handle: Hyperview.createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      styleAttr: `${prefix}:handle-style`,
    }),
    overlay: Hyperview.createStyleProp(props.element, props.stylesheets, {
      ...props.options,
      styleAttr: `${prefix}:overlay-style`,
    }),
  };

  const gestureEnabled =
    hvProps.stopPoints.length > 0 || hvProps.contentSections.length > 0;
  const PADDING = Platform.select({
    android: DEFAULT_PADDING_ANDROID,
    default: 0,
    ios: gestureEnabled ? insets.top : 0,
  });

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
  const [closing, setClosing] = useState(false);
  const [height, setHeight] = useState(0);

  const overlayOpacity = useSharedValue(0);
  const context = useSharedValue({ startTime: Date.now(), y: 0 });
  const translateY = useSharedValue(0);
  const [upcomingTranslateY, setUpcomingTranslateY] = useState(0);
  const velocity = useSharedValue(0);
  const targetOpacity: number = hvStyles.overlay[0]?.opacity ?? 1;

  const scrollTo = useCallback(
    (destination: number) => {
      'worklet';

      // reanimated takes time to set translateY value but
      // we need the new value to calculate whether innerView should scroll
      // so we use upcomingTranslateY to handle this case
      runOnJS(setUpcomingTranslateY)(destination);
      translateY.value = withSpring(destination, {
        damping: Math.max(
          hvProps.animationDuration * DEFAULT_DAMPING_MULTIPLIER,
          MIN_DAMPING,
        ),
      });
    },
    [hvProps.animationDuration, translateY],
  );

  useEffect(() => {
    if (contentSectionHeights[0] !== undefined) {
      scrollTo(-contentSectionHeights[0] - PADDING);
    }
  }, [contentSectionHeights, scrollTo, PADDING]);

  useEffect(() => {
    // if height changes from onLayout while bottom sheet is open
    // adjust scroll position of sheet accordingly:
    if (visible && !closing) {
      if (hvProps.stopPoints.length > 0) {
        const [firstStopPointLocation] = stopPointLocations;
        if (firstStopPointLocation !== null) {
          scrollTo(-SCREEN_HEIGHT * firstStopPointLocation);
        }
      } else {
        scrollTo(-height - PADDING);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

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
  }, [
    height,
    contentSectionHeights,
    stopPointLocations,
    hvProps.animationDuration,
    targetOpacity,
    overlayOpacity,
    hvProps.contentSections.length,
    hvProps.stopPoints.length,
    scrollTo,
    PADDING,
  ]);

  const hide = useCallback(() => {
    if (hvProps.toggleEventName) {
      Events.dispatch(hvProps.toggleEventName);
    }
    setVisible(false);
    setClosing(false);
  }, [hvProps.toggleEventName]);

  const animateClose = useCallback(() => {
    'worklet';

    runOnJS(setClosing)(true);
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
  }, [scrollTo, hvProps.animationDuration, overlayOpacity, hide]);

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
      } else if (!closing) {
        animateClose();
      }
    },
    [hvProps.toggleEventName, visible, closing, animateOpen, animateClose],
  );

  useEffect(() => {
    Events.subscribe(onHyperviewEventDispatch);
    return () => {
      Events.unsubscribe(onHyperviewEventDispatch);
    };
  }, [onHyperviewEventDispatch, visible]);

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
        scrollTo(context.value.y);
      } else if (velocity.value < 0) {
        // Moving upwards, find the next stop point above
        nextStopPoint = dragUpHelper(
          stopPointLocations,
          SCREEN_HEIGHT,
          translateY.value,
        );
      } else {
        // Moving downwards, find the next stop point below
        nextStopPoint = dragDownHelper(
          stopPointLocations,
          SCREEN_HEIGHT,
          translateY.value,
        );
      }

      if (nextStopPoint > -1) {
        scrollTo(
          // Make sure to not drag past the max height of the screen
          Math.max(
            MAX_TRANSLATE_Y,
            -nextStopPoint * SCREEN_HEIGHT - PADDING,
            -height - PADDING,
          ),
        );
      }
    }
  };

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
      transform: [{ translateY: translateY.value }],
    };
  });

  const onStartShouldSetResponder = useCallback(() => {
    return gestureEnabled && upcomingTranslateY > MAX_TRANSLATE_Y;
  }, [gestureEnabled, upcomingTranslateY, MAX_TRANSLATE_Y]);

  const children = useMemo(() => {
    const childNodes = Array.from(props.element.childNodes).filter(
      n => (n as Element).tagName !== 'bottom-sheet:stop-point',
    );

    return Hyperview.renderChildNodes(
      childNodes,
      props.stylesheets,
      props.onUpdate,
      props.options,
    );
  }, [
    props.element.childNodes,
    props.onUpdate,
    props.options,
    props.stylesheets,
  ]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height: sheetHeight } = event.nativeEvent.layout;
    setHeight(sheetHeight);
  };

  const innerView =
    Platform.OS === 'ios' ? (
      <View
        onLayout={onLayout}
        onStartShouldSetResponder={onStartShouldSetResponder}
      >
        <>{children}</>
      </View>
    ) : (
      <View onLayout={onLayout}>
        <ScrollView
          nestedScrollEnabled
          scrollEnabled={upcomingTranslateY <= MAX_TRANSLATE_Y}
        >
          {children}
        </ScrollView>
      </View>
    );

  const content = (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.bottomSheetContainer,
          bottomSheetStyle,
          hvStyles.container,
          {
            height: SCREEN_HEIGHT,
            top: SCREEN_HEIGHT,
          },
        ]}
      >
        {gestureEnabled && <View style={[styles.handle, hvStyles.handle]} />}
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
    setContentSectionHeights(prevHeights => {
      const currentHeights = [...prevHeights];
      currentHeights[index] = contentSectionHeight;
      return currentHeights;
    });
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
