/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
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

const appNavigator = createStackNavigator({
  Main: MainStackNavigator,
  Modal: ModalStackNavigator,
}, {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'Main',
  initialRouteParams: {
    url: 'http://0.0.0.0:8085/validate.xml',
  }
});

export default createAppContainer(appNavigator);
