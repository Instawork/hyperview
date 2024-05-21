import * as Keyboard from 'hyperview/src/services/keyboard';
import * as Logging from 'hyperview/src/core/logging';
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
  ScrollView,
  View,
  ViewStyle,
} from 'react-native';
import React, { PureComponent } from 'react';
import { ATTRIBUTES } from './types';
import KeyboardAwareScrollView from 'hyperview/src/core/components/keyboard-aware-scroll-view';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
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
    const textAreas = this.props.element.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'text-area',
    );
    return textFields.length > 0 || textAreas.length > 0;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getScrollViewProps = (children: Array<any>): ScrollViewProps => {
    const horizontal =
      this.attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
    const showScrollIndicator =
      this.attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';

    const contentContainerStyle = (this.attributes[
      ATTRIBUTES.CONTENT_CONTAINER_STYLE
    ]
      ? createStyleProp(this.props.element, this.props.stylesheets, {
          ...this.props.options,
          styleAttr: ATTRIBUTES.CONTENT_CONTAINER_STYLE,
        })
      : undefined) as ViewStyle;

    // Fix scrollbar rendering issue in iOS 13+
    // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
    const scrollIndicatorInsets =
      Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13
        ? { right: 1 }
        : undefined;

    // add sticky indices
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stickyHeaderIndices = children.reduce<Array<any>>(
      // eslint-disable-next-line no-confusing-arrow
      (acc, element, index) =>
        typeof element !== 'string' &&
        element.props?.element?.getAttribute('sticky') === 'true'
          ? [...acc, index]
          : acc,
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
      return Number.isNaN(offset) ? 0 : defaultOffset;
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
      this.props.onUpdate as HvComponentOnUpdate,
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
        return React.createElement(
          KeyboardAwareScrollView,
          {
            ...this.getCommonProps(),
            ...this.getScrollViewProps(children),
            ...this.getKeyboardAwareScrollViewProps(inputFieldRefs),
          },
          ...children,
        );
      }
      return React.createElement(
        ScrollView,
        {
          ...this.getCommonProps(),
          ...this.getScrollViewProps(children),
        },
        ...children,
      );
    }
    if (!keyboardAvoiding && safeArea) {
      return React.createElement(
        SafeAreaView,
        this.getCommonProps(),
        ...children,
      );
    }
    if (keyboardAvoiding) {
      return React.createElement(
        KeyboardAvoidingView,
        { ...this.getCommonProps(), behavior: 'position' },
        ...children,
      );
    }
    return React.createElement(View, this.getCommonProps(), ...children);
    /* eslint-enable react/jsx-props-no-spreading */
  };

  render() {
    const { Content } = this;
    return this.props.options?.skipHref ? (
      <Content />
    ) : (
      addHref(
        <Content />,
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate as HvComponentOnUpdate,
        this.props.options,
      )
    );
  }
}
