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
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import React, { PureComponent } from 'react';
import { addHref, createProps } from 'hyperview/src/services';
import type { HvComponentProps } from 'hyperview/src/types';
import type { InternalProps } from './types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { LOCAL_NAME } from 'hyperview/src/types';

export default class HvView extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.VIEW;
  static localNameAliases = [
    LOCAL_NAME.BODY,
    LOCAL_NAME.FORM,
    LOCAL_NAME.HEADER,
    LOCAL_NAME.ITEM,
    LOCAL_NAME.SECTION_TITLE,
  ];
  props: HvComponentProps;

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    let viewOptions = options;
    const { skipHref } = viewOptions || {};
    const props: InternalProps = createProps(element, stylesheets, viewOptions);
    const scrollable = !!element.getAttribute('scroll');
    const keyboardAvoiding = !!element.getAttribute('avoid-keyboard');
    let c = View;

    /**
     * Useful when you want keyboard avoiding behavior in non-scrollable views.
     * Note: Android has built-in support for avoiding keyboard.
     */
    if (keyboardAvoiding && Platform.OS === 'ios') {
      c = KeyboardAvoidingView;
      props.behavior = 'position';
    }

    const inputRefs = [];
    if (scrollable) {
      const textFields = element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'text-field',
      );
      const textAreas = element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'text-area',
      );
      const hasFields = textFields.length > 0 || textAreas.length > 0;
      c = hasFields ? KeyboardAwareScrollView : ScrollView;
      if (hasFields) {
        const scrollToInputAdditionalOffset = element.getAttribute(
          'scroll-to-input-offset',
        );
        const defaultScrollToInputAdditionalOffset = 120;
        if (scrollToInputAdditionalOffset) {
          const parsedOffset = parseInt(scrollToInputAdditionalOffset, 10);
          props.scrollToInputAdditionalOffset = isNaN(parsedOffset)
            ? 0
            : defaultScrollToInputAdditionalOffset;
        } else {
          props.scrollToInputAdditionalOffset = defaultScrollToInputAdditionalOffset;
        }

        props.keyboardOpeningTime = 0;
        props.keyboardShouldPersistTaps = 'handled';
        props.scrollEventThrottle = 16;
        props.getTextInputRefs = () => inputRefs;
        const registerInputHandler = ref => {
          inputRefs.push(ref);
        };
        viewOptions = { ...viewOptions, registerInputHandler };
      }

      const scrollDirection = element.getAttribute('scroll-orientation');
      if (scrollDirection === 'horizontal') {
        props.horizontal = true;
      }
    }

    const component = React.createElement(
      c,
      props,
      ...Render.renderChildren(element, stylesheets, onUpdate, viewOptions),
    );
    return skipHref
      ? component
      : addHref(component, element, stylesheets, onUpdate, viewOptions);
  }
}
