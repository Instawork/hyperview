/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HyperviewScreen from '../screens/HyperviewScreen';

const MainStackNavigator = createStackNavigator(
  {
    MainStack: HyperviewScreen,
  },
  {
    headerMode: 'none',
  },
);

const ModalStackNavigator = createStackNavigator(
  {
    ModalStack: HyperviewScreen,
  },
  {
    headerMode: 'none',
    initialRouteParams: {
      modal: true,
    },
  },
);

export default createStackNavigator({
  Main: MainStackNavigator,
  Modal: ModalStackNavigator,
}, {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'Main',
  initialRouteParams: {
    url: 'http://192.168.2.73:8085/index.xml',
  }
});
