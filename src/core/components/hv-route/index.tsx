/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { Document } from 'hyperview/src/core/components/hv-navigator/types';
import { NavigationContext } from 'hyperview/src/contexts/navigation';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
type State = { doc: Document; error: string; url: string };

export default class HvRoute extends PureComponent<Props, State> {
  static contextType = NavigationContext;

  static defaultProps = {};

  render() {
    return (
      <View>
        <Text>ROUTE</Text>
      </View>
    );
  }
}
