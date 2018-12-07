import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import HyperviewScreen from '../screens/HyperviewScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HyperviewStack = createStackNavigator(
  {
    Stack: HyperviewScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Stack',
    initialRouteParams: {
      url: 'http://10.1.10.14:8087/index.xml',
    },
  },
);

export default HyperviewStack;
