import * as Keyboard from 'hyperview/src/services/keyboard';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  ScrollView,
} from 'hyperview/src/core/components/scroll';
import React, { useCallback, useMemo, useRef } from 'react';
import { ATTRIBUTES } from './types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { useStyleProp } from 'hyperview/src/services';

const HvView = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { focused, pressed, pressedSelected, selected, styleAttr } = options;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputFieldRefs = useRef<Array<any | undefined>>([]);

  const attributes = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.values(ATTRIBUTES).reduce<Record<string, any>>(
      (attrs, name: string) => ({
        ...attrs,
        [name]: element.getAttribute(name),
      }),
      {},
    );
  }, [element]);

  const hasInputFields = useMemo(() => {
    const textFields = element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'text-field',
    );

    return textFields.length > 0;
  }, [element]);

  const style = useStyleProp(element, stylesheets, {
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr,
  });

  const containerStyle = useStyleProp(element, stylesheets, {
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr: ATTRIBUTES.CONTENT_CONTAINER_STYLE,
  });

  const viewConfig = useMemo(() => {
    /**
     * Useful when you want keyboard avoiding behavior in non-scrollable views.
     * Note: Android has built-in support for avoiding keyboard.
     */
    const keyboardAvoiding =
      attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true' && Platform.OS === 'ios';
    const scrollable = attributes[ATTRIBUTES.SCROLL] === 'true';
    const safeArea = attributes[ATTRIBUTES.SAFE_AREA] === 'true';

    if (safeArea && (keyboardAvoiding || scrollable)) {
      Logging.warn('safe-area is incompatible with scroll or avoid-keyboard');
    }

    return { keyboardAvoiding, safeArea, scrollable };
  }, [attributes]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registerInputHandler = useCallback((ref: any) => {
    if (ref !== null) {
      inputFieldRefs.current.push(ref);
    }
  }, []);

  const children = useMemo(
    () =>
      Render.renderChildren(element, stylesheets, onUpdate, {
        ...options,
        ...(viewConfig.scrollable && hasInputFields
          ? {
              registerInputHandler,
            }
          : {}),
      }),
    [
      element,
      hasInputFields,
      onUpdate,
      options,
      registerInputHandler,
      stylesheets,
      viewConfig.scrollable,
    ],
  );

  const commonProps = useMemo(() => {
    const id = element.getAttribute('id');
    if (!id) {
      return { style };
    }
    if (Platform.OS === 'ios') {
      return { style, testID: id };
    }
    return { accessibilityLabel: id, style };
  }, [element, style]);

  const scrollViewProps = useMemo(() => {
    const horizontal =
      attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
    const showScrollIndicator =
      attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';

    const contentContainerStyle = attributes[ATTRIBUTES.CONTENT_CONTAINER_STYLE]
      ? containerStyle
      : undefined;

    // Fix scrollbar rendering issue in iOS 13+
    // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    const scrollIndicatorInsets =
      Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13
        ? { right: 1 }
        : undefined;

    // add sticky indices
    const stickyHeaderIndices = children.reduce<Array<number>>(
      (acc, ele, index) => {
        if (
          typeof ele !== 'string' &&
          ele?.props.element?.getAttribute?.('sticky') === 'true'
        ) {
          return [...acc, index];
        }
        return acc;
      },
      [],
    );

    return {
      contentContainerStyle,
      horizontal,
      keyboardDismissMode: Keyboard.getKeyboardDismissMode(element),
      scrollIndicatorInsets,
      showsHorizontalScrollIndicator: horizontal && showScrollIndicator,
      showsVerticalScrollIndicator: !horizontal && showScrollIndicator,
      stickyHeaderIndices,
    };
  }, [attributes, children, containerStyle, element]);

  const keyboardAwareScrollViewProps = useMemo(() => {
    const getScrollToInputAdditionalOffsetProp = (): number => {
      const defaultOffset = 120;
      const offsetStr = attributes[ATTRIBUTES.SCROLL_TO_INPUT_OFFSET];
      if (offsetStr) {
        const offset = parseInt(offsetStr, 10);
        return Number.isNaN(offset) ? 0 : defaultOffset;
      }
      return defaultOffset;
    };

    return {
      automaticallyAdjustContentInsets: false,
      getTextInputRefs: () => inputFieldRefs.current,
      keyboardShouldPersistTaps: 'handled',
      scrollEventThrottle: 16,
      scrollToInputAdditionalOffset: getScrollToInputAdditionalOffsetProp(),
    };
  }, [attributes, inputFieldRefs]);

  const content = useMemo(() => {
    /* eslint-disable react/jsx-props-no-spreading */
    if (viewConfig.scrollable) {
      if (hasInputFields) {
        // TODO: Replace with <HvChildren>
        return React.createElement(
          KeyboardAwareScrollView,
          {
            element,
            ...commonProps,
            ...scrollViewProps,
            ...keyboardAwareScrollViewProps,
          },
          ...children,
        );
      }
      // TODO: Replace with <HvChildren>
      return React.createElement(
        ScrollView,
        {
          element,
          ...commonProps,
          ...scrollViewProps,
        },
        ...children,
      );
    }
    if (!viewConfig.keyboardAvoiding && viewConfig.safeArea) {
      // TODO: Replace with <HvChildren>
      return React.createElement(SafeAreaView, commonProps, ...children);
    }
    if (viewConfig.keyboardAvoiding) {
      // TODO: Replace with <HvChildren>
      return React.createElement(
        KeyboardAvoidingView,
        {
          ...commonProps,
          behavior: 'position',
        },
        ...children,
      );
    }
    // TODO: Replace with <HvChildren>
    return React.createElement(View, commonProps, ...children);
    /* eslint-enable react/jsx-props-no-spreading */
  }, [
    children,
    element,
    hasInputFields,
    commonProps,
    scrollViewProps,
    keyboardAwareScrollViewProps,
    viewConfig.scrollable,
    viewConfig.keyboardAvoiding,
    viewConfig.safeArea,
  ]);

  return options?.skipHref
    ? content
    : addHref(
        content,
        element,
        stylesheets,
        onUpdate as HvComponentOnUpdate,
        options,
      );
};

HvView.namespaceURI = Namespaces.HYPERVIEW;
HvView.localName = LOCAL_NAME.VIEW;
HvView.localNameAliases = [
  LOCAL_NAME.BODY,
  LOCAL_NAME.FORM,
  LOCAL_NAME.HEADER,
  LOCAL_NAME.ITEM,
  LOCAL_NAME.ITEMS,
  LOCAL_NAME.SECTION_TITLE,
];

export default HvView;
