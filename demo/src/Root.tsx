/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PureComponent } from 'react';
import { Button, SafeAreaView, View } from 'react-native';
import NavigatorLegacy from './NavigatorLegacy';
import Navigator from './Navigator';

type Props = {};
type State = { useLegacy: boolean };

/**
 * Branch the demo/example to use new navigation or old navigation
 */
export default class Root extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      useLegacy: false,
    };
  }

  /**
   * Provide the selection UI
   */
  BranchSelection = () => (
    <View style={{ flexDirection: 'row' }}>
      <Button
        title="Updated"
        onPress={() => this.setState({ useLegacy: false })}
      />
      <Button
        title="Legacy"
        onPress={() => this.setState({ useLegacy: true })}
      />
    </View>
  );

  render() {
    const { BranchSelection } = this;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BranchSelection />
        {this.state.useLegacy ? <NavigatorLegacy /> : <Navigator />}
      </SafeAreaView>
    );
  }
}
