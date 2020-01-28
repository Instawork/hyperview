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
import React, { PureComponent } from 'react';
import { addHref, createProps } from 'hyperview/src/services';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { Text } from 'react-native';

export default class HvText extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.TEXT;
  static localNameAliases = [];
  props: HvComponentProps;

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    const { skipHref } = options || {};
    const props = createProps(element, stylesheets, options);
    const component = React.createElement(
      Text,
      props,
      ...Render.renderChildren(element, stylesheets, onUpdate, options),
    );

    return skipHref
      ? component
      : addHref(component, element, stylesheets, onUpdate, options);
  }
}
