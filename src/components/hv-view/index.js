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
import type { Attribute, Element, HvComponentProps } from 'hyperview/src/types';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import React, { PureComponent } from 'react';
import type { InternalProps } from './types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';

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

  isHiddenElement = (attributes: Attribute[]): boolean => {
    for (let j = 0; j < attributes.length; j += 1) {
      if (attributes[j].name === 'hide' && attributes[j].value === 'true') {
        return true;
      }
    }
    return false;
  };

  canRenderElement = (element: Element): boolean => {
    // ignore non rendering and hidden elements
    return (
      this.props.options.componentRegistry &&
      this.props.options.componentRegistry[element.namespaceURI] &&
      this.props.options.componentRegistry[element.namespaceURI][
        element.localName
      ] &&
      // $FlowFixMe
      !this.isHiddenElement(Array.from(element.attributes ?? []))
    );
  };

  getElementsToRender = (): Element[] => {
    // do not include non rendering elements while calculating index
    // $FlowFixMe
    const childNodes: Element[] = Array.from(
      this.props.element.childNodes ?? [],
    );
    return childNodes.filter(element => this.canRenderElement(element));
  };

  getStickyElementIndices = (): number[] => {
    const elements = this.getElementsToRender();
    return elements.reduce((acc, element, index) => {
      // $FlowFixMe
      const attributes: Attribute[] = Array.from(element.attributes ?? []);
      attributes.forEach(attribute => {
        if (attribute.name === 'sticky' && attribute.value === 'true') {
          acc.push(index);
        }
      });
      return acc;
    }, []);
  };

  render() {
    let viewOptions = this.props.options;
    const { skipHref } = viewOptions || {};
    const props: InternalProps = createProps(
      this.props.element,
      this.props.stylesheets,
      viewOptions,
    );
    const scrollable = !!this.props.element.getAttribute('scroll');
    const keyboardAvoiding = !!this.props.element.getAttribute(
      'avoid-keyboard',
    );
    const safeArea = this.props.element.getAttribute('safe-area') === 'true';
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

    const inputRefs = [];
    if (scrollable) {
      safeAreaIncompatible = true;
      const textFields = this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'text-field',
      );
      const textAreas = this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        'text-area',
      );
      const hasFields = textFields.length > 0 || textAreas.length > 0;
      c = hasFields ? KeyboardAwareScrollView : ScrollView;
      if (hasFields) {
        const scrollToInputAdditionalOffset = this.props.element.getAttribute(
          'scroll-to-input-offset',
        );
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
        props.getTextInputRefs = () => inputRefs;
        const registerInputHandler = ref => {
          if (ref !== null) {
            inputRefs.push(ref);
          }
        };
        viewOptions = { ...viewOptions, registerInputHandler };
      }

      const scrollDirection = this.props.element.getAttribute(
        'scroll-orientation',
      );
      if (scrollDirection === 'horizontal') {
        props.horizontal = true;
      }

      if (scrollDirection !== 'horizontal') {
        const stickyHeaderIndices = this.getStickyElementIndices();
        if (stickyHeaderIndices.length) {
          props.stickyHeaderIndices = stickyHeaderIndices;
        }
      }
    }

    if (safeArea) {
      if (safeAreaIncompatible) {
        console.warn('safe-area is incompatible with scroll or avoid-keyboard');
      } else {
        c = SafeAreaView;
      }
    }

    // $FlowFixMe
    const component = React.createElement(
      c,
      props,
      ...Render.renderChildren(
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate,
        viewOptions,
      ),
    );
    return skipHref
      ? component
      : addHref(
          component,
          this.props.element,
          this.props.stylesheets,
          this.props.onUpdate,
          viewOptions,
        );
  }
}
