/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { Text } from 'react-native';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';

export default class HvText extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.TEXT;

  static localNameAliases = [];

  render() {
    const { skipHref } = this.props.options || {};
    const props = createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    const component = React.createElement(
      Text,
      props,
      ...Render.renderChildren(
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate as HvComponentOnUpdate,
        {
          ...this.props.options,
          preformatted:
            this.props.element.getAttribute('preformatted') === 'true',
        },
      ),
    );

    return skipHref
      ? component
      : addHref(
          component,
          this.props.element,
          this.props.stylesheets,
          this.props.onUpdate as HvComponentOnUpdate,
          this.props.options,
        );
  }
}
