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
    url: 'http://0.0.0.0:8085/index.xml',
  }
});
