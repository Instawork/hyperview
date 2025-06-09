import * as Keyboard from 'hyperview/src/services/keyboard';
import * as Namespaces from 'hyperview/src/services/namespaces';
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
import { Platform, ViewStyle } from 'react-native';
import { ATTRIBUTES } from './types';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import View from './View';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { useStyleProp } from 'hyperview/src/services';

const HvView = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;

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

  const style = (useStyleProp(
    element,
    stylesheets,
    options,
  ) as unknown) as ViewStyle;

  const getCommonProps = (): CommonProps => {
    // TODO: fix type
    // createStyleProp returns an array of StyleSheet,
    // but it appears something wants a ViewStyle, which is not
    // not an array type. Does a type need to get fixed elsewhere?
    const id = element.getAttribute('id');
    if (!id) {
      return { style };
    }
    if (Platform.OS === 'ios') {
      return { style, testID: id };
    }
    return { accessibilityLabel: id, style };
  };

  const containerStyle = useStyleProp(element, stylesheets, {
    ...options,
    styleAttr: ATTRIBUTES.CONTENT_CONTAINER_STYLE,
  });

  const getScrollViewProps = (
    children: Array<React.ReactElement<HvComponentProps> | null | string>,
  ): ScrollViewProps => {
    const attributes = getAttributes();
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

  const content = (
    <View
      attributes={getAttributes()}
      element={element}
      getCommonProps={getCommonProps}
      getKeyboardAwareScrollViewProps={getKeyboardAwareScrollViewProps}
      getScrollViewProps={getScrollViewProps}
      hasInputFields={hasInputFields}
      onUpdate={onUpdate}
      options={options}
      stylesheets={stylesheets}
    />
  );

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
