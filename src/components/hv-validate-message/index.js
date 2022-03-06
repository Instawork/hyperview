// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import { Text } from 'react-native';
import { createProps } from 'hyperview/src/services';
import { getFirstInvalidMessage } from 'hyperview/src/services/validation';
import { HYPERVIEW_VALIDATION } from 'hyperview/src/services/namespaces';

export default class HvValidateMessage extends PureComponent<HvComponentProps> {
  static namespaceURI = HYPERVIEW_VALIDATION;

  static localName = "message";

  static localNameAliases = [];

  props: HvComponentProps;

  getDocument = () => {
    const element: Element = this.props.element;
    let node: ?Node = element;
    while(node.parentNode) {
      node = node.parentNode;
    }
    return node;
  };

  render() {
    const element: Element = this.props.element;
    const source: ?string = element.getAttribute("source");

    const doc: ?Document = this.getDocument();
    const sourceElement: ?Element = doc ? doc.getElementById(source) : null;
    const message: ?string = sourceElement ? getFirstInvalidMessage(sourceElement) : null;

    const props = createProps(
      element,
      this.props.stylesheets,
      this.props.options,
    );
    return React.createElement(
      Text,
      props,
      [message || ""],
    );
  }
}
