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
  HvComponentOptions,
  HvComponentProps,
  StyleSheets,
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
import React, { useEffect, useRef } from 'react';
import { ATTRIBUTES } from './types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createStyleProp } from 'hyperview/src/services';

const HvView = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, stylesheets, onUpdate, options } = props;

  const currentElement = useRef<Element | null>(null);
  const currentStylesheets = useRef<StyleSheets | null>(null);
  const currentOnUpdate = useRef<HvComponentOnUpdate | null>(null);
  const currentOptions = useRef<HvComponentOptions | null>(null);

  useEffect(() => {
    if (currentElement.current !== element) {
      console.log('element changed');
    }
    if (currentStylesheets.current !== stylesheets) {
      console.log('stylesheets changed');
    }
    if (currentOnUpdate.current !== onUpdate) {
      console.log('onUpdate changed');
    }
    if (currentOptions.current !== options) {
      console.log('options changed');
      // (Object.keys(options) as Array<keyof HvComponentOptions>).forEach(key => {
      //   if (options[key] !== currentOptions.current?.[key]) {
      //     console.log(`option ${key} changed`);
      //   }
      // });
    }
    currentElement.current = element;
    currentStylesheets.current = stylesheets;
    currentOnUpdate.current = onUpdate;
    currentOptions.current = options;
  }, [element, stylesheets, onUpdate, options]);

  const getAttributes = (): Attributes => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.values(ATTRIBUTES).reduce<Record<string, any>>(
      (attributes, name: string) => ({
        ...attributes,
        [name]: element.getAttribute(name),
      }),
      {},
    );
  };

  const hasInputFields = (): boolean => {
    const textFields = element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'text-field',
    );

    return textFields.length > 0;
  };

  const getCommonProps = (): CommonProps => {
    // TODO: fix type
    // createStyleProp returns an array of StyleSheet,
    // but it appears something wants a ViewStyle, which is not
    // not an array type. Does a type need to get fixed elsewhere?
    const style = (createStyleProp(
      element,
      stylesheets,
      options,
    ) as unknown) as ViewStyle;
    const id = element.getAttribute('id');
    if (!id) {
      return { style };
    }
    if (Platform.OS === 'ios') {
      return { style, testID: id };
    }
    return { accessibilityLabel: id, style };
  };

  const getScrollViewProps = (
    children: Array<React.ReactElement<HvComponentProps> | null | string>,
  ): ScrollViewProps => {
    const attributes = getAttributes();
    const horizontal =
      attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
    const showScrollIndicator =
      attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';

    const contentContainerStyle = attributes[ATTRIBUTES.CONTENT_CONTAINER_STYLE]
      ? createStyleProp(element, stylesheets, {
          ...options,
          styleAttr: ATTRIBUTES.CONTENT_CONTAINER_STYLE,
        })
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
          ele?.props?.element?.getAttribute('sticky') === 'true'
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
  };

  const getScrollToInputAdditionalOffsetProp = (): number => {
    const defaultOffset = 120;
    const offsetStr = getAttributes()[ATTRIBUTES.SCROLL_TO_INPUT_OFFSET];
    if (offsetStr) {
      const offset = parseInt(offsetStr, 10);
      return Number.isNaN(offset) ? 0 : defaultOffset;
    }
    return defaultOffset;
  };

  const getKeyboardAwareScrollViewProps = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputFieldRefs: Array<any>,
  ): KeyboardAwareScrollViewProps => ({
    automaticallyAdjustContentInsets: false,
    getTextInputRefs: () => inputFieldRefs,
    keyboardShouldPersistTaps: 'handled',
    scrollEventThrottle: 16,
    scrollToInputAdditionalOffset: getScrollToInputAdditionalOffsetProp(),
  });

  const Content = () => {
    /**
     * Useful when you want keyboard avoiding behavior in non-scrollable views.
     * Note: Android has built-in support for avoiding keyboard.
     */
    const attributes = getAttributes();
    const keyboardAvoiding =
      attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true' && Platform.OS === 'ios';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputFieldRefs: Array<any | undefined> = [];
    const scrollable = attributes[ATTRIBUTES.SCROLL] === 'true';
    const safeArea = attributes[ATTRIBUTES.SAFE_AREA] === 'true';
    if (safeArea) {
      if (keyboardAvoiding || scrollable) {
        Logging.warn('safe-area is incompatible with scroll or avoid-keyboard');
      }
    }

    const children = Render.renderChildren(
      element,
      stylesheets,
      onUpdate as HvComponentOnUpdate,
      {
        ...options,
        ...(scrollable && hasInputFields()
          ? {
              registerInputHandler: ref => {
                if (ref !== null) {
                  inputFieldRefs.push(ref);
                }
              },
            }
          : {}),
      },
    );

    /* eslint-disable react/jsx-props-no-spreading */
    if (scrollable) {
      if (hasInputFields()) {
        return React.createElement(
          KeyboardAwareScrollView,
          {
            element,
            ...getCommonProps(),
            ...getScrollViewProps(children),
            ...getKeyboardAwareScrollViewProps(inputFieldRefs),
          },
          ...children,
        );
      }
      return React.createElement(
        ScrollView,
        {
          element,
          ...getCommonProps(),
          ...getScrollViewProps(children),
        },
        ...children,
      );
    }
    if (!keyboardAvoiding && safeArea) {
      return React.createElement(SafeAreaView, getCommonProps(), ...children);
    }
    if (keyboardAvoiding) {
      return React.createElement(
        KeyboardAvoidingView,
        { ...getCommonProps(), behavior: 'position' },
        ...children,
      );
    }
    return React.createElement(View, getCommonProps(), ...children);
    /* eslint-enable react/jsx-props-no-spreading */
  };

  return options?.skipHref ? (
    <Content />
  ) : (
    addHref(
      <Content />,
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
