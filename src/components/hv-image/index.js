// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import { addHref, createProps } from 'hyperview/src/services';
import { Image } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Props } from './types';
import urlParse from 'url-parse';

export default class HvImage extends PureComponent<Props> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.IMAGE;
  props: Props;

  render() {
    const { element, stylesheets, onUpdate, options } = this.props;
    const { skipHref } = options || {};
    const imageProps = {};
    if (element.getAttribute('source')) {
      let source = element.getAttribute('source');
      source = urlParse(source, options.screenUrl, true).toString();
      imageProps.source = { uri: source };
    }
    const props = Object.assign(
      createProps(element, stylesheets, options),
      imageProps,
    );
    const component = React.createElement(Image, props);
    return skipHref
      ? component
      : addHref(component, element, stylesheets, onUpdate, options);
  }
}
