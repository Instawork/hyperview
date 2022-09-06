// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type { Attributes, InternalProps } from './types';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import { createProps, createStyleProp } from 'hyperview/src/services';
import { ATTRIBUTES } from './types';
import type { HvComponentProps } from 'hyperview/src/types';
import KeyboardAwareScrollView from 'hyperview/src/core/components/keyboard-aware-scroll-view';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';

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

  props: HvComponentProps;

  attributes: Attributes;

  constructor(props: HvComponentProps) {
    super(props);
    this.updateAttributes();
  }

  componentDidUpdate(prevProps: HvComponentProps) {
    if (prevProps.element === this.props.element) {
      return;
    }

    this.updateAttributes();
  }

  updateAttributes = () => {
    // $FlowFixMe: reduce returns a mixed type, not Attributes
    this.attributes = Object.values(ATTRIBUTES).reduce(
      (attributes, name: string) => ({
        ...attributes,
        [name]: this.props.element.getAttribute(name),
      }),
      {},
    );
  };

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

  render() {
    const props: InternalProps = createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    const scrollable = this.attributes[ATTRIBUTES.SCROLL] === 'true';
    const horizontal =
      this.attributes[ATTRIBUTES.SCROLL_ORIENTATION] === 'horizontal';
    const showScrollIndicator =
      this.attributes[ATTRIBUTES.SHOWS_SCROLL_INDICATOR] !== 'false';
    const keyboardAvoiding =
      this.attributes[ATTRIBUTES.AVOID_KEYBOARD] === 'true';
    const safeArea = this.attributes[ATTRIBUTES.SAFE_AREA] === 'true';
    let safeAreaIncompatible = false;
    let c = View;

    /**
     * Useful when you want keyboard avoiding behavior in non-scrollable views.
     * Note: Android has built-in support for avoiding keyboard.
     */
    if (keyboardAvoiding && Platform.OS === 'ios') {
      safeAreaIncompatible = true;
      c = KeyboardAvoidingView;
      props.behavior = 'position';
    }

    const hasInputFields = this.hasInputFields();
    const inputFieldRefs = [];
    if (scrollable) {
      c = ScrollView;
      safeAreaIncompatible = true;
      if (hasInputFields) {
        c = KeyboardAwareScrollView;
        const scrollToInputAdditionalOffset = this.attributes[
          ATTRIBUTES.SCROLL_TO_INPUT_OFFSET
        ];
        const defaultScrollToInputAdditionalOffset = 120;
        if (scrollToInputAdditionalOffset) {
          const parsedOffset = parseInt(scrollToInputAdditionalOffset, 10);
          props.scrollToInputAdditionalOffset = Number.isNaN(parsedOffset)
            ? 0
            : defaultScrollToInputAdditionalOffset;
        } else {
          props.scrollToInputAdditionalOffset = defaultScrollToInputAdditionalOffset;
        }

        props.keyboardOpeningTime = 0;
        props.keyboardShouldPersistTaps = 'handled';
        props.automaticallyAdjustContentInsets = false;
        props.scrollEventThrottle = 16;
        props.getTextInputRefs = () => inputFieldRefs;
      }

      props.showsHorizontalScrollIndicator = horizontal && showScrollIndicator;
      props.showsVerticalScrollIndicator = !horizontal && showScrollIndicator;

      if (this.attributes[ATTRIBUTES.CONTENT_CONTAINER_STYLE]) {
        props.contentContainerStyle = createStyleProp(
          this.props.element,
          this.props.stylesheets,
          {
            ...this.props.options,
            styleAttr: ATTRIBUTES.CONTENT_CONTAINER_STYLE,
          },
        );
      }

      // Fix scrollbar rendering issue in iOS 13+
      // https://github.com/facebook/react-native/issues/26610#issuecomment-539843444
      if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13) {
        props.scrollIndicatorInsets = { right: 1 };
      }

      if (horizontal) {
        props.horizontal = true;
      }
    }

    if (safeArea) {
      if (safeAreaIncompatible) {
        console.warn('safe-area is incompatible with scroll or avoid-keyboard');
      } else {
        c = SafeAreaView;
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

    if (scrollable && !horizontal) {
      // add sticky indicies
      const stickyIndices = children.reduce(
        (acc, element, index) =>
          typeof element !== 'string' &&
          element.props?.element?.getAttribute('sticky') === 'true'
            ? [...acc, index]
            : acc,
        [],
      );
      if (stickyIndices.length) {
        props.stickyHeaderIndices = stickyIndices;
      }
    }

    // $FlowFixMe
    const component = React.createElement(c, props, ...children);
    return this.props.options?.skipHref
      ? component
      : addHref(
          component,
          this.props.element,
          this.props.stylesheets,
          this.props.onUpdate,
          this.props.options,
        );
  }
}
