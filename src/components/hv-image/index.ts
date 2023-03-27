/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import { Image } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';
import urlParse from 'url-parse';

export default class HvImage extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.IMAGE;

  static localNameAliases = [];

  declare props: HvComponentProps;

  render() {
    const { skipHref } = this.props.options || {};
    let source: Image['props']['source'] = {};
    const srcAttr = this.props.element.getAttribute('src');
    if (srcAttr) {
      source.uri = urlParse(
        srcAttr,
        this.props.options.screenUrl,
        true,
      ).toString();
    }
    const props = {
      ...createProps(
        this.props.element,
        this.props.stylesheets,
        this.props.options,
      ),
      source,
    } as const;
    const component = React.createElement(Image, props);
    return skipHref
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
