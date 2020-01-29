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
import { ActivityIndicator } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';

export default class HvSpinner extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.SPINNER;
  static localNameAliases = [];
  props: HvComponentProps;

  render() {
    const { element } = this.props;
    const color = element.getAttribute('color') || undefined;
    return <ActivityIndicator color={color} />;
  }
}
