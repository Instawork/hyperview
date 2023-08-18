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
import type { HvComponentProps } from 'hyperview/src/types';
import HyperRef from 'hyperview/src/core/hyper-ref';
import { LOCAL_NAME } from 'hyperview/src/types';
import { Text } from 'react-native';
import { createProps } from 'hyperview/src/services';

export default class HvText extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.TEXT;

  static localNameAliases = [];

  props: HvComponentProps;

  render() {
    const { skipHref } = this.props.options || {};
    if (!skipHref) {
      return (
        <HyperRef
          element={this.props.element}
          onUpdate={this.props.onUpdate}
          options={this.props.options}
          stylesheets={this.props.stylesheets}
        />
      );
    }
    const props = createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    return React.createElement(
      Text,
      props,
      ...Render.renderChildren(
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate,
        {
          ...this.props.options,
          preformatted:
            this.props.element.getAttribute('preformatted') === 'true',
        },
      ),
    );
  }
}
