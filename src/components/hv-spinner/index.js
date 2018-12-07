/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Props } from './types';

export default class HvSpinner extends PureComponent<Props> {
  static namespaceURI = Namespaces.HYPERVIEW;
  static localName = LOCAL_NAME.SPINNER;
  props: Props;

  render() {
    const { element } = this.props;
    const color = element.getAttribute('color') || undefined;
    return <ActivityIndicator color={color} />;
  }
}
