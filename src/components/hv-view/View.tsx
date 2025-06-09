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
  // eslint-disable-next-line react/destructuring-assignment
  const {
    attributes,
    element,
    getCommonProps,
    getScrollViewProps,
    getKeyboardAwareScrollViewProps,
    hasInputFields,
    onUpdate,
    options,
    stylesheets,
  } = props;
  /**
   * Useful when you want keyboard avoiding behavior in non-scrollable views.
   * Note: Android has built-in support for avoiding keyboard.
   */
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

  const children = Render.renderChildren(element, stylesheets, onUpdate, {
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
  });

  /* eslint-disable react/jsx-props-no-spreading */
  if (scrollable) {
    if (hasInputFields()) {
      // TODO: Replace with <HvChildren>
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
    // TODO: Replace with <HvChildren>
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
