/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import { Image, ImageProps } from 'react-native';
import React, { PureComponent } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';
import urlParse from 'url-parse';

export default class HvImage extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.IMAGE;

  static localNameAliases = [];

  render() {
    const { skipHref } = this.props.options || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageProps: Record<string, any> = {};
    let source = this.props.element.getAttribute('source');
    if (source) {
      source = urlParse(source, this.props.options.screenUrl, true).toString();
      imageProps.source = { uri: source };
    }
    const props = {
      ...createProps(
        this.props.element,
        this.props.stylesheets,
        this.props.options,
      ),
      ...imageProps,
    } as ImageProps;
    const component = React.createElement(Image, props);
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
