import * as Logging from 'hyperview/src/services/logging';
import * as Render from 'hyperview/src/services/render';
import { ATTRIBUTES, ViewProps } from './types';
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
import React from 'react';

export default (props: ViewProps) => {
  /**
   * Useful when you want keyboard avoiding behavior in non-scrollable views.
   * Note: Android has built-in support for avoiding keyboard.
   */
  const keyboardAvoiding =
    props.attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true' &&
    Platform.OS === 'ios';

  const hasInputFields = props.hasInputFields();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputFieldRefs: Array<any | undefined> = [];
  const scrollable = props.attributes[ATTRIBUTES.SCROLL] === 'true';
  const safeArea = props.attributes[ATTRIBUTES.SAFE_AREA] === 'true';
  if (safeArea) {
    if (keyboardAvoiding || scrollable) {
      Logging.warn('safe-area is incompatible with scroll or avoid-keyboard');
    }
  }

  const children = Render.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    {
      ...props.options,
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
          element: props.element,
          ...props.getCommonProps(),
          ...props.getScrollViewProps(children),
          ...props.getKeyboardAwareScrollViewProps(inputFieldRefs),
        },
        ...children,
      );
    }
    // TODO: Replace with <HvChildren>
    return React.createElement(
      ScrollView,
      {
        element: props.element,
        ...props.getCommonProps(),
        ...props.getScrollViewProps(children),
      },
      ...children,
    );
  }
  if (!keyboardAvoiding && safeArea) {
    // TODO: Replace with <HvChildren>
    return React.createElement(
      SafeAreaView,
      props.getCommonProps(),
      ...children,
    );
  }
  if (keyboardAvoiding) {
    // TODO: Replace with <HvChildren>
    return React.createElement(
      KeyboardAvoidingView,
      {
        ...props.getCommonProps(),
        behavior: 'position',
      },
      ...children,
    );
  }
  // TODO: Replace with <HvChildren>
  return React.createElement(View, props.getCommonProps(), ...children);
  /* eslint-enable react/jsx-props-no-spreading */
};
