import React from 'react';
import { Button, View, Image, Text, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { DOMParser } from 'xmldom';

const ROOT = 'http://127.0.0.1:8080';

class HyperView extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions, screenProps }) => {

    const title = navigation.getParam('screenTitle');
    const headerRight = navigation.getParam('headerRight');
    return {
      title,
      headerRight,
    };
  }

  constructor(props){
    super(props);
    this.state ={
      isLoading: true,
      styles: null,
    }

    this.parser = new DOMParser();

    const path = this.props.navigation.getParam('source', null);
    const url = ROOT + path;
    fetch(url, {headers: {'Cache-Control': 'no-cache'}})
      .then((response) => response.text())
      .then((responseText) => {
        const doc = this.parser.parseFromString(responseText);

        const styles = doc.getElementsByTagName('styles');
        const stylesheet = {};
        if (styles && styles[0]) {
          const ruleElements = styles[0].getElementsByTagName('rule');

          for (let i = 0; i < ruleElements.length; ++i) {
            const ruleElement = ruleElements.item(i);
            const ruleId = ruleElement.getAttribute('id');
            if (!ruleId) {
              return;
            }

            const ruleStyles = {};
            for (let j = 0; j < ruleElement.attributes.length; ++j) {
              let attr = ruleElement.attributes.item(j);
              if (attr.name !== 'id') {
                let intValue = parseInt(attr.value, 10);
                ruleStyles[attr.name] = intValue || attr.value;
              }
            }
            stylesheet[ruleId] = ruleStyles;
          };
        }

        this.setState({
          doc: doc,
          isLoading: false,
          styles: StyleSheet.create(stylesheet),
        });

        const headers = doc.getElementsByTagName('header');
        if (headers && headers[0]) {
          const header = headers[0];

          const titles = header.getElementsByTagName('title');
          let screenTitle = null;
          if (titles && titles[0]) {
            screenTitle = titles[0].childNodes[0].nodeValue;
          }

          const rights = header.getElementsByTagName('right');
          let headerRight = null;
          if (rights && rights[0] && rights[0].childNodes) {
            headerRight = this.renderElement(rights[0].childNodes[1]);
          }

          props.navigation.setParams({
            screenTitle,
            headerRight,
          });
        }
      });
  }

  getComponentForElement(element) {
    switch (element.tagName) {
      case 'body':
        if (element.getAttribute('scroll')) {
          return ScrollView;
        } else {
          return View;
        }
      case 'a':
        return TouchableHighlight;
      case 'view':
        return View;
      case 'button':
        return Button;
      case 'text':
        return Text;
      case 'image':
        return Image;
    }

    return null;
  }

  getPropsForElement(element) {
    let props = {};
    if (element.attributes === null) {
      return props;
    }
    for (let i = 0; i < element.attributes.length; ++i) {
      let attr = element.attributes.item(i);
      props[attr.name] = attr.value;
    }

    if (props.styles) {
      props.style = this.state.styles[props.styles];
      delete props.styles;
    }

    if (element.tagName === 'button' || element.tagName === 'a') {
      if (props.source) {
        let navFunction = this.props.navigation.push;
        let navRoute = 'Stack';

        if (props.target == 'push') {
          navFunction = this.props.navigation.push;
        } else if (props.target == 'replace') {
          navFunction = this.props.navigation.replace;
        } else if (props.target == 'navigate') {
          navFunction = this.props.navigation.navigate;
        } else if (props.target == 'modal') {
          navRoute = 'Modal';
        }

        props['onPress'] = () => navFunction(
          navRoute,
          { source: props.source },
        );
      }
    }

    if (element.tagName === 'a') {
      props.underlayColor = '#fff';
      props.activeOpacity = 0.5;
    }

    if (element.tagName === 'image') {
      if (props.source) {
        props.source = {uri: props.source};
      }
    }

    return props;
  }

  getChildrenForElement(element) {
    if (element.childNodes === null) {
      return [];
    }
    const childElements = [];
    for (let i = 0; i < element.childNodes.length; ++i) {
      childElements[i] = this.renderElement(element.childNodes.item(i));
    }
    return childElements;
  }

  renderElement(element) {
    const component = this.getComponentForElement(element);
    if (component === null) {
      return element.nodeValue;
    }
    const props = this.getPropsForElement(element);
    const children = this.getChildrenForElement(element);

    if (element.tagName === 'a') {
      // HACK
      return React.createElement(component, props, children[1]);
    }
    return React.createElement(component, props, ...children);
  }

  render() {
    if(this.state.isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    const body = this.state.doc.getElementsByTagName('body')[0];
    return this.renderElement(body);
  }
}

const MainStack = createStackNavigator(
  {
    Stack: HyperView,
  },
  {
    initialRouteName: 'Stack',
    initialRouteParams: {
      source: '/dashboard/gigs',
    }
  }
);

const RootStack = createStackNavigator(
  {
    Main: MainStack,
    Modal: HyperView,
  },
  {
    mode: 'modal',
    headerMode: 'none',
    initialRouteName: 'Main',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
