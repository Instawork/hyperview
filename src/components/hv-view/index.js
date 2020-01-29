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
import * as ScrollContext from 'hyperview/src/services/scroll-context';
import React, { PureComponent } from 'react';
import { ScrollView, View } from 'react-native';
import { addHref, createProps } from 'hyperview/src/services';
import type { HvComponentProps } from 'hyperview/src/types';
import type { InternalProps } from './types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { LOCAL_NAME } from 'hyperview/src/types';

const ScrollViewWithScrollContext = ScrollContext.withScrollableComponent(
  ScrollView,
);
const KeyboardAwareScrollViewWithScrollContext = ScrollContext.withScrollableComponent(
  KeyboardAwareScrollView,
);

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
    let Component = View;
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
      Component = hasFields
        ? KeyboardAwareScrollViewWithScrollContext
        : ScrollViewWithScrollContext;

      props.id = element.getAttribute('id');
      if (hasFields) {
        props.extraScrollHeight = 32;
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
      Component,
      props,
      ...Render.renderChildren(element, stylesheets, onUpdate, viewOptions),
    );
    return skipHref
      ? component
      : addHref(component, element, stylesheets, onUpdate, viewOptions);
  }
}
