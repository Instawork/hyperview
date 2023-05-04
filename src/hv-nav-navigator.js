import {
  getInitialNavRouteNode,
  getChildElements,
  getProp,
} from 'hyperview/src/navigator-helpers';
import HyperviewRoute from 'hyperview/src/hv-nav-route';
import HyperScreen from 'hyperview';
import HyperNavigator from 'hyperview/src/hv-nav-navigator';
import NavContext, { NavProvider } from './hv-nav-context';
import { LOCAL_NAME, NAVIGATOR_TYPE } from 'hyperview/src/types';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

/**
 * HyperviewNavigator provides logic to process a <navigator> element.
 * Props:
 * - fetch: the fetch function to use to load the document
 * - onParseBefore: a function to call before parsing the document
 * - onParseAfter: a function to call after parsing the document
 * - formatDate: a function to format dates
 * - parent: the parent component
 * - doc: the document to render
 * */
export default class HyperviewNavigator extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextType = NavContext;

  componentDidMount() {
    try {
      const doc = getProp(this.props, 'doc');
      const fetch = getProp(this.props, 'fetch', this.context);
      const onParseBefore = getProp(this.props, 'onParseBefore', this.context);
      const onParseAfter = getProp(this.props, 'onParseAfter', this.context);
      const formatDate = getProp(this.props, 'formatDate', this.context);

      const id = doc.getAttribute('id');
      const type = doc.getAttribute('type');
      const initialNode = getInitialNavRouteNode(doc);
      const initialId = initialNode.getAttribute('id');

      this.setState({
        doc,
        fetch,
        onParseBefore,
        onParseAfter,
        formatDate,
        id,
        type,
        initialNode,
        initialId,
        error: null,
      });
    } catch (err) {
      this.setState({
        doc: null,
        fetch: null,
        onParseBefore: null,
        onParseAfter: null,
        formatDate: null,
        id: null,
        type: null,
        initialNode: null,
        initialId: null,
        error: err,
      });
    }
  }

  buildScreens = (navigator: Navigator) => {
    const screens = [];
    const elements = getChildElements(this.state.doc);
    for (let i = 0; i < elements.length; i++) {
      const node = elements[i];
      let name = '';
      if (
        node.nodeName === LOCAL_NAME.NAVIGATOR ||
        node.nodeName === LOCAL_NAME.NAV_ROUTE
      ) {
        name = node.getAttribute('id');
      }
      // console.log('buildScreens', node.nodeName, name);
      let component = null;
      let initialParams = {};
      switch (node.nodeName) {
        case LOCAL_NAME.NAVIGATOR:
          component = HyperNavigator;
          initialParams = {
            doc: this.state.doc,
          };
          break;
        case LOCAL_NAME.NAV_ROUTE:
          component = HyperviewRoute;
          initialParams = {
            url: node.getAttribute('href'),
          };
          break;
        default:
          continue;
      }

      screens.push(
        <navigator.Screen
          name={name}
          key={name}
          initialParams={initialParams}
          component={component}
        />,
      );
    }
    return screens;
  };

  buildNavigator = (id: String, initialRouteName: String, options: Object) => {
    let screens;
    let navigator;
    switch (this.state.type) {
      case NAVIGATOR_TYPE.STACK:
        navigator = Stack;
        break;
      case NAVIGATOR_TYPE.TOP_TAB:
        navigator = TopTab;
        break;
      case NAVIGATOR_TYPE.BOTTOM_TAB:
        navigator = BottomTab;
        break;
      default:
        return null;
    }
    screens = this.buildScreens(navigator);
    // console.log('buildNavigator', screens.length, initialRouteName);
    if (screens.length === 0) {
      return null;
    }

    const providerValue = {
      fetch: this.state.fetch,
      formatDate: this.state.formatDate,
      parent: this,
    };

    return (
      <NavProvider value={providerValue}>
        <navigator.Navigator
          id={id}
          initialRouteName={initialRouteName}
          screenOptions={options}
        >
          {screens}
        </navigator.Navigator>
      </NavProvider>
    );
    return null;
  };

  render() {
    if (!this.state) {
      return (
        <View>
          <Text>NAV WAITING</Text>
          <ActivityIndicator />
        </View>
      );
    } else if (this.state?.error) {
      return (
        <View>
          <Text>NAV ERROR:{this.state.error.message}</Text>
        </View>
      );
    }

    const navigator = this.buildNavigator(this.state.id, this.state.initialId, {
      headerShown: true,
    });
    if (!navigator) {
      return (
        <View>
          <Text>NAV ERROR: No Navigator</Text>
        </View>
      );
    }
    return navigator;
  }
}
