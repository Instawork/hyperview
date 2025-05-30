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
import React, { useMemo } from 'react';
import { ATTRIBUTES } from './types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createStyleProp } from 'hyperview/src/services';

const HvView = (props: HvComponentProps) => {
  const attributes = useMemo((): Attributes => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.values(ATTRIBUTES).reduce<Record<string, any>>(
      (acc, name: string) => ({
        ...acc,
        [name]: props.element.getAttribute(name),
      }),
      {},
    );
  }, [props.element]);

  const checkHasInputFields = (): boolean => {
    const textFields = props.element.getElementsByTagNameNS(
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
      props.element,
      props.stylesheets,
      props.options,
    ) as unknown) as ViewStyle;
    const id = props.element.getAttribute('id');
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
    const horizontal =
      attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
    const showScrollIndicator =
      attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';

    const contentContainerStyle = attributes[ATTRIBUTES.CONTENT_CONTAINER_STYLE]
      ? createStyleProp(props.element, props.stylesheets, {
          ...props.options,
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
      (acc, element, index) => {
        if (
          typeof element !== 'string' &&
          element?.props.element?.getAttribute?.('sticky') === 'true'
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
      keyboardDismissMode: Keyboard.getKeyboardDismissMode(props.element),
      scrollIndicatorInsets,
      showsHorizontalScrollIndicator: horizontal && showScrollIndicator,
      showsVerticalScrollIndicator: !horizontal && showScrollIndicator,
      stickyHeaderIndices,
    };
  };

  const getScrollToInputAdditionalOffsetProp = (): number => {
    const defaultOffset = 120;
    const offsetStr = attributes[ATTRIBUTES.SCROLL_TO_INPUT_OFFSET];
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

  const Content = (p: HvComponentProps) => {
    /**
     * Useful when you want keyboard avoiding behavior in non-scrollable views.
     * Note: Android has built-in support for avoiding keyboard.
     */
    const keyboardAvoiding =
      attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true' && Platform.OS === 'ios';

    const hasInputFields = checkHasInputFields();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputFieldRefs: Array<any | undefined> = [];
    const scrollable = attributes[ATTRIBUTES.SCROLL] === 'true';
    const safeArea = attributes[ATTRIBUTES.SAFE_AREA] === 'true';
    if (safeArea) {
      if (keyboardAvoiding || scrollable) {
        Logging.warn('safe-area is incompatible with scroll or avoid-keyboard');
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
  };

  return props.options?.skipHref ? (
    <Content
      element={props.element}
      onUpdate={props.onUpdate}
      options={props.options}
      stylesheets={props.stylesheets}
    />
  ) : (
    addHref(
      <Content
        element={props.element}
        onUpdate={props.onUpdate}
        options={props.options}
        stylesheets={props.stylesheets}
      />,
      props.element,
      props.stylesheets,
      props.onUpdate as HvComponentOnUpdate,
      props.options,
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
