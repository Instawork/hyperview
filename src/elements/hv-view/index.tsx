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
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
  ViewStyle,
} from 'react-native';
// eslint-disable-next-line instawork/import-components
import {
  KeyboardAwareScrollView,
  ScrollView,
} from 'hyperview/src/components/scroll';
import React, { PureComponent } from 'react';
import { ATTRIBUTES } from './types';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { createStyleProp } from 'hyperview/src/services';

export default class HvView extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.VIEW;

  static localNameAliases = [
    LOCAL_NAME.BODY,
    LOCAL_NAME.FORM,
    LOCAL_NAME.HEADER,
    LOCAL_NAME.ITEM,
    LOCAL_NAME.ITEMS,
    LOCAL_NAME.SECTION_TITLE,
  ];

  static supportsHyperRef = true;

  get attributes(): Attributes {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.values(ATTRIBUTES).reduce<Record<string, any>>(
      (attributes, name: string) => ({
        ...attributes,
        [name]: this.props.element.getAttribute(name),
      }),
      {},
    );
  }

  hasInputFields = (): boolean => {
    const textFields = this.props.element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'text-field',
    );

    return textFields.length > 0;
  };

  getCommonProps = (): CommonProps => {
    // TODO: fix type
    // createStyleProp returns an array of StyleSheet,
    // but it appears something wants a ViewStyle, which is not
    // not an array type. Does a type need to get fixed elsewhere?
    const style = (createStyleProp(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    ) as unknown) as ViewStyle;
    const id = this.props.element.getAttribute('id');
    if (!id) {
      return { style };
    }
    if (Platform.OS === 'ios') {
      return { style, testID: id };
    }
    return { accessibilityLabel: id, style };
  };

  getScrollViewProps = (
    children: Array<React.ReactElement<HvComponentProps> | null | string>,
  ): ScrollViewProps => {
    const horizontal =
      this.attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
    const showScrollIndicator =
      this.attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';

    const contentContainerStyle = this.attributes[
      ATTRIBUTES.CONTENT_CONTAINER_STYLE
    ]
      ? createStyleProp(this.props.element, this.props.stylesheets, {
          ...this.props.options,
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
      keyboardDismissMode: Keyboard.getKeyboardDismissMode(this.props.element),
      scrollIndicatorInsets,
      showsHorizontalScrollIndicator: horizontal && showScrollIndicator,
      showsVerticalScrollIndicator: !horizontal && showScrollIndicator,
      stickyHeaderIndices,
    };
  };

  getScrollToInputAdditionalOffsetProp = (): number => {
    const defaultOffset = 120;
    const offsetStr = this.attributes[ATTRIBUTES.SCROLL_TO_INPUT_OFFSET];
    if (offsetStr) {
      const offset = parseInt(offsetStr, 10);
      return Number.isNaN(offset) ? defaultOffset : offset;
    }
    return defaultOffset;
  };

  getKeyboardAwareScrollViewProps = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputFieldRefs: Array<any>,
  ): KeyboardAwareScrollViewProps => ({
    automaticallyAdjustContentInsets: false,
    getTextInputRefs: () => inputFieldRefs,
    keyboardShouldPersistTaps: 'handled',
    scrollEventThrottle: 16,
    scrollToInputAdditionalOffset: this.getScrollToInputAdditionalOffsetProp(),
  });

  Content = () => {
    /**
     * Useful when you want keyboard avoiding behavior in non-scrollable views.
     * Note: Android has built-in support for avoiding keyboard.
     */
    const keyboardAvoiding =
      this.attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true' &&
      Platform.OS === 'ios';

    const hasInputFields = this.hasInputFields();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputFieldRefs: Array<any | undefined> = [];
    const scrollable = this.attributes[ATTRIBUTES.SCROLL] === 'true';
    const safeArea = this.attributes[ATTRIBUTES.SAFE_AREA] === 'true';
    if (safeArea) {
      if (keyboardAvoiding || scrollable) {
        Logging.warn('safe-area is incompatible with scroll or avoid-keyboard');
      }
    }

    const children = Render.renderChildren(
      this.props.element,
      this.props.stylesheets,
      this.props.onUpdate,
      {
        ...this.props.options,
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
    );

    /* eslint-disable react/jsx-props-no-spreading */
    if (scrollable) {
      if (hasInputFields) {
        // TODO: Replace with <HvChildren>
        return React.createElement(
          KeyboardAwareScrollView,
          {
            element: this.props.element,
            ...this.getCommonProps(),
            ...this.getScrollViewProps(children),
            ...this.getKeyboardAwareScrollViewProps(inputFieldRefs),
          },
          ...children,
        );
      }
      // TODO: Replace with <HvChildren>
      return React.createElement(
        ScrollView,
        {
          element: this.props.element,
          ...this.getCommonProps(),
          ...this.getScrollViewProps(children),
        },
        ...children,
      );
    }
    if (!keyboardAvoiding && safeArea) {
      // TODO: Replace with <HvChildren>
      return React.createElement(
        SafeAreaView,
        this.getCommonProps(),
        ...children,
      );
    }
    if (keyboardAvoiding) {
      // TODO: Replace with <HvChildren>
      return React.createElement(
        KeyboardAvoidingView,
        {
          ...this.getCommonProps(),
          behavior: 'position',
        },
        ...children,
      );
    }
    // TODO: Replace with <HvChildren>
    return React.createElement(View, this.getCommonProps(), ...children);
    /* eslint-enable react/jsx-props-no-spreading */
  };

  render() {
    const { Content } = this;
    return <Content />;
  }
}
