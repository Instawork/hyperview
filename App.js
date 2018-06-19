import React from 'react';
import { Button, View, Image, Text, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { DOMParser } from 'xmldom';

const ROOT = 'http://10.1.10.14:8080';


function createProps(element, stylesheet) {
  const props = {};
  if (element.attributes === null) {
    return props;
  }
  for (let i = 0; i < element.attributes.length; ++i) {
    let attr = element.attributes.item(i);
    props[attr.name] = attr.value;
  }
  if (props.styles) {
    props.style = stylesheet[props.styles];
    delete props.styles;
  }
}

function onPressProps(element, navigation) {
  const props = {};
  const source = element.getAttribute('source');
  const target = element.getAttribute('target');

  if (!source) {
    return props;
  }

  let navFunction = navigation.push;
  let navRoute = 'Stack';

  if (props.target == 'push') {
    navFunction = navigation.push;
  } else if (props.target == 'replace') {
    navFunction = navigation.replace;
  } else if (props.target == 'navigate') {
    navFunction = navigation.navigate;
  } else if (props.target == 'modal') {
    navRoute = 'Modal';
  }

  props['onPress'] = () => navFunction(
    navRoute,
    { source: props.source },
  );

  return props;
}

function anchor(element, navigation, stylesheet, children) {
  const props = Object.assign(
    createProps(element, stylesheet),
    onPressProps(element, navigation),
    { underlayColor: '#fff', activeOpacity: 0.5 },
  );
  return React.createElement(
    TouchableHighlight,
    props,
    children.length > 0 ? children[0] : null
  );
}

function body(element, navigation, stylesheet, children) {
  let component = View;
  if (element.getAttribute('scroll')) {
    component = ScrollView;
  }
  const props = createProps(element, stylesheet);
  return React.createElement(
    component,
    props,
    children
  );
}

function button(element, navigation, stylesheet, children) {
  const props = Object.assign(
    createProps(element, stylesheet),
    onPressProps(element, navigation)
  );
  return React.createElement(
    Button,
    props,
    children
  );
}

function image(element, navigation, stylesheet, children) {
  const imageProps = {};
  if (element.getAttribute('source')) {
    imageProps.source = { uri: element.getAttribute('source')};
  }
  const props = Object.assign(
    createProps(element, stylesheet),
    imageProps
  );
  return React.createElement(
    Image,
    props,
    children
  );
}

function view(element, navigation, stylesheet, children) {
  const props = createProps(element, stylesheet);
  return React.createElement(
    View,
    props,
    children
  );
}

function text(element, navigation, stylesheet, children) {
  const props = createProps(element, stylesheet);
  return React.createElement(
    Text,
    props,
    children
  );
}

function renderElement(element, navigation, stylesheet) {
  const children = [];
  if (element.childNodes !== null) {
    for (let i = 0; i < element.childNodes.length; ++i) {
      let e = renderElement(element.childNodes.item(i), navigation, stylesheet);
      if (e) {
        children.push(e);
      }
    }
  }

  switch (element.tagName) {
    case 'a':
      return anchor(element, this.props.navigation, this.state.styles, children); 
    case 'body':
      return body(element, this.props.navigation, this.state.styles, children); 
    case 'button':
      return button(element, this.props.navigation, this.state.styles, children); 
    case 'image':
      return image(element, this.props.navigation, this.state.styles, children); 
    case 'text':
      return text(element, this.props.navigation, this.state.styles, children); 
    case 'view':
      return view(element, this.props.navigation, this.state.styles, children); 
  }

  if (element.nodeValue && element.nodeValue.trim().length > 0) {
    return element.nodeValue.trim();
  }
  return null;
}


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
    fetch(url)
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
            //headerRight = renderElement(rights[0].childNodes[1]);
          }

          props.navigation.setParams({
            screenTitle,
            headerRight,
          });
        }
      });
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
    return renderElement(body, this.props.navigation, this.state.styles);
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
