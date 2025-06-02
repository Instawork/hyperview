import * as Keyboard from 'hyperview/src/services/keyboard';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  Attributes,
  CommonProps,
  KeyboardAwareScrollViewProps,
  ScrollViewProps,
} from './types';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
  ViewStyle,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  ScrollView,
} from 'hyperview/src/core/components/scroll';
import React, { useCallback, useMemo } from 'react';
import { ATTRIBUTES } from './types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createStyleProp } from 'hyperview/src/services';

const HvView = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;

  const attributes = useMemo((): Attributes => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.values(ATTRIBUTES).reduce<Record<string, any>>(
      (acc, name: string) => ({
        ...acc,
        [name]: element.getAttribute(name),
      }),
      {},
    );
  }, [element]);

  const { focused, pressed, pressedSelected, selected } = options;
  const { styleAttr } = options;

  // TODO: fix type
  // createStyleProp returns an array of StyleSheet,
  // but it appears something wants a ViewStyle, which is not
  // not an array type. Does a type need to get fixed elsewhere?
  const style = useMemo(() => {
    return (createStyleProp(element, stylesheets, {
      focused,
      pressed,
      pressedSelected,
      selected,
      styleAttr,
    }) as unknown) as ViewStyle;
  }, [
    element,
    focused,
    pressed,
    pressedSelected,
    selected,
    styleAttr,
    stylesheets,
  ]);

  const containerStyle = useMemo(() => {
    return createStyleProp(element, stylesheets, {
      focused,
      pressed,
      pressedSelected,
      selected,
      styleAttr: ATTRIBUTES.CONTENT_CONTAINER_STYLE,
    });
  }, [element, focused, pressed, pressedSelected, selected, stylesheets]);

  const checkHasInputFields = useCallback((): boolean => {
    const textFields = element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'text-field',
    );

    return textFields.length > 0;
  }, [element]);

  const getCommonProps = useCallback((): CommonProps => {
    const id = element.getAttribute('id');
    if (!id) {
      return { style };
    }
    if (Platform.OS === 'ios') {
      return { style, testID: id };
    }
    return { accessibilityLabel: id, style };
  }, [element, style]);

  const getScrollViewProps = useCallback(
    (
      children: Array<React.ReactElement<HvComponentProps> | null | string>,
    ): ScrollViewProps => {
      const horizontal =
        attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
      const showScrollIndicator =
        attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';

      const contentContainerStyle = attributes[
        ATTRIBUTES.CONTENT_CONTAINER_STYLE
      ]
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
        (acc, el, index) => {
          if (
            typeof el !== 'string' &&
            el?.props.element?.getAttribute?.('sticky') === 'true'
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
    },
    [attributes, containerStyle, element],
  );

  const getScrollToInputAdditionalOffsetProp = useCallback((): number => {
    const defaultOffset = 120;
    const offsetStr = attributes[ATTRIBUTES.SCROLL_TO_INPUT_OFFSET];
    if (offsetStr) {
      const offset = parseInt(offsetStr, 10);
      return Number.isNaN(offset) ? 0 : defaultOffset;
    }
    return defaultOffset;
  }, [attributes]);

  const getKeyboardAwareScrollViewProps = useCallback(
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputFieldRefs: Array<any>,
    ): KeyboardAwareScrollViewProps => ({
      automaticallyAdjustContentInsets: false,
      getTextInputRefs: () => inputFieldRefs,
      keyboardShouldPersistTaps: 'handled',
      scrollEventThrottle: 16,
      scrollToInputAdditionalOffset: getScrollToInputAdditionalOffsetProp(),
    }),
    [getScrollToInputAdditionalOffsetProp],
  );

  const Content = useCallback(
    (p: HvComponentProps) => {
      /**
       * Useful when you want keyboard avoiding behavior in non-scrollable views.
       * Note: Android has built-in support for avoiding keyboard.
       */
      const keyboardAvoiding =
        attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true' &&
        Platform.OS === 'ios';

      const hasInputFields = checkHasInputFields();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inputFieldRefs: Array<any | undefined> = [];
      const scrollable = attributes[ATTRIBUTES.SCROLL] === 'true';
      const safeArea = attributes[ATTRIBUTES.SAFE_AREA] === 'true';
      if (safeArea) {
        if (keyboardAvoiding || scrollable) {
          Logging.warn(
            'safe-area is incompatible with scroll or avoid-keyboard',
          );
        }
      }

      const children = Render.buildChildArray(
        p.element,
        p.onUpdate,
        {
          ...p.options,
          ...(scrollable && hasInputFields
            ? {
                registerInputHandler: ref => {
                  if (ref !== null) {
                    inputFieldRefs.push(ref);
                  }
                },
              }
            : {}),
        },
        p.stylesheets,
      );

      /* eslint-disable react/jsx-props-no-spreading */
      if (scrollable) {
        if (hasInputFields) {
          // TODO: Replace with <HvChildren>
          return React.createElement(
            KeyboardAwareScrollView,
            {
              element: p.element,
              ...getCommonProps(),
              ...getScrollViewProps(children),
              ...getKeyboardAwareScrollViewProps(inputFieldRefs),
            },
            ...children,
          );
        }
        // TODO: Replace with <HvChildren>
        return React.createElement(
          ScrollView,
          {
            element: p.element,
            ...getCommonProps(),
            ...getScrollViewProps(children),
          },
          ...children,
        );
      }
      if (!keyboardAvoiding && safeArea) {
        // TODO: Replace with <HvChildren>
        return React.createElement(SafeAreaView, getCommonProps(), ...children);
      }
      if (keyboardAvoiding) {
        // TODO: Replace with <HvChildren>
        return React.createElement(
          KeyboardAvoidingView,
          {
            ...getCommonProps(),
            behavior: 'position',
          },
          ...children,
        );
      }
      // TODO: Replace with <HvChildren>
      return React.createElement(View, getCommonProps(), ...children);
      /* eslint-enable react/jsx-props-no-spreading */
    },
    [
      attributes,
      checkHasInputFields,
      getCommonProps,
      getKeyboardAwareScrollViewProps,
      getScrollViewProps,
    ],
  );

  return options?.skipHref ? (
    <Content
      element={element}
      onUpdate={onUpdate}
      options={options}
      stylesheets={stylesheets}
    />
  ) : (
    addHref(
      <Content
        element={element}
        onUpdate={onUpdate}
        options={options}
        stylesheets={stylesheets}
      />,
      element,
      stylesheets,
      onUpdate as HvComponentOnUpdate,
      options,
    )
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
