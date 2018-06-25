import React from 'react';
import { Button, View, Image, Text, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { DOMParser } from 'xmldom';

const ROOT = 'http://192.168.7.20:8080';


/**
 *
 */
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
  return props;
}

/**
 *
 */
function onPressProps(element, navigation) {
  const props = {};
  const href = element.getAttribute('href');
  const target = element.getAttribute('target');
  const targetHasHeader = element.getAttribute('target-has-header') === 'true';

  if (!href) {
    return props;
  }

  let navFunction = navigation.push;
  let navRoute = 'Stack';

  if (target == 'push') {
    navFunction = navigation.push;
  } else if (target == 'replace') {
    navFunction = navigation.replace;
  } else if (target == 'navigate') {
    navFunction = navigation.navigate;
  } else if (target == 'back') {
  } else if (target == 'modal') {
    navRoute = 'Modal';
  }

  props['onPress'] = () => navFunction(
    navRoute,
    {
      href,
      targetHasHeader,
    },
  );

  return props;
}

/**
 *
 */
function anchor(element, navigation, stylesheet) {
  const props = Object.assign(
    createProps(element, stylesheet),
    onPressProps(element, navigation),
    { underlayColor: '#fff', activeOpacity: 0.5 },
  );
  const children = renderChildren(element, navigation, stylesheet)
  return React.createElement(
    TouchableHighlight,
    props,
    children.length > 0 ? children[0] : null
  );
}

/**
 *
 */
function body(element, navigation, stylesheet) {
  let component = View;
  if (element.getAttribute('scroll')) {
    component = ScrollView;
  }
  const props = createProps(element, stylesheet);
  return React.createElement(
    component,
    props,
    ...renderChildren(element, navigation, stylesheet)
  );
}

/**
 *
 */
function button(element, navigation, stylesheet) {
  const props = Object.assign(
    createProps(element, stylesheet),
    onPressProps(element, navigation)
  );
  return React.createElement(
    Button,
    props,
    ...renderChildren(element, navigation, stylesheet)
  );
}

/**
 *
 */
function image(element, navigation, stylesheet) {
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
    props
  );
}

/**
 *
 */
function view(element, navigation, stylesheet) {
  const props = createProps(element, stylesheet);
  return React.createElement(
    View,
    props,
    ...renderChildren(element, navigation, stylesheet)
  );
}

/**
 *
 */
function text(element, navigation, stylesheet) {
  const props = createProps(element, stylesheet);
  return React.createElement(
    Text,
    props,
    ...renderChildren(element, navigation, stylesheet)
  );
}

/**
 *
 */
function renderHeader(element, navigation, stylesheet) {
  const headers = element.getElementsByTagName('header');
  if (!(headers && headers[0])) {
    return null;
  }
  const header = headers[0];

  const titles = header.getElementsByTagName('title');
  let screenTitle = null;
  if (titles && titles[0]) {
    screenTitle = titles[0].childNodes[0].nodeValue;
  }

  const rights = header.getElementsByTagName('right');
  let headerRight = null;
  if (rights && rights[0] && rights[0].childNodes) {
    headerRight = renderElement(
      rights[0].childNodes[1],
      navigation,
      stylesheet,
    );
  }

  const lefts = header.getElementsByTagName('left');
  let headerLeft = null;
  if (lefts && lefts[0] && lefts[0].childNodes) {
    headerLeft = renderElement(
      lefts[0].childNodes[1],
      navigation,
      stylesheet,
    );
  }

  navigation.setParams({
    screenTitle,
    headerRight,
    headerLeft,
  });
}

/**
 *
 */
function renderChildren(element, navigation, stylesheet) {
  const children = [];
  if (element.childNodes !== null) {
    for (let i = 0; i < element.childNodes.length; ++i) {
      let e = renderElement(element.childNodes.item(i), navigation, stylesheet);
      if (e) {
        children.push(e);
      }
    }
  }
  return children;
}

/**
 *
 */
function renderElement(element, navigation, stylesheet) {
  switch (element.tagName) {
    case 'a':
      return anchor(element, navigation, stylesheet); 
    case 'body':
      return body(element, navigation, stylesheet); 
    case 'button':
      return button(element, navigation, stylesheet); 
    case 'image':
      return image(element, navigation, stylesheet); 
    case 'text':
      return text(element, navigation, stylesheet); 
    case 'view':
      return view(element, navigation, stylesheet); 
  }

  if (element.nodeValue && element.nodeValue.trim().length > 0) {
    return element.nodeValue.trim();
  }
  return null;
}

/**
 *
 */
function createStylesheet(element) {
  const styles = element.getElementsByTagName('styles');
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

  return StyleSheet.create(stylesheet); 
}

/**
 *
 */
class HyperView extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions, screenProps }) => {
    const title = navigation.getParam('screenTitle');
    const headerRight = navigation.getParam('headerRight');
    const headerLeft = navigation.getParam('headerLeft');
    const targetHasHeader = navigation.getParam('targetHasHeader');
    console.log('has header?', targetHasHeader);
    console.log('title: ', title);
    const options = {
      title,
      headerRight,
    };
    if (headerLeft) {
      options.headerLeft = headerLeft;
    }
    if (!targetHasHeader) {
      if (!(title || headerRight || headerLeft)) {
        options.header = null;
      }
    }
    return options;
  }

  constructor(props){
    super(props);
    this.parser = new DOMParser();
    this.state ={
      isLoading: true,
      styles: null,
    }
  }

  componentDidMount() {
    const path = this.props.navigation.getParam('href', null);
    const url = ROOT + path;
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const doc = this.parser.parseFromString(responseText);

        const stylesheet = createStylesheet(doc);
        const header = renderHeader(doc, this.props.navigation, stylesheet);
        this.props.navigation.setParams({ header });

        this.setState({
          doc: doc,
          isLoading: false,
          styles: stylesheet,
        });
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

/**
 *
 */
const MainStack = createStackNavigator(
  {
    Stack: HyperView,
  },
  {
    initialRouteName: 'Stack',
    initialRouteParams: {
      href: '/dashboard/gigs',
    }
  }
);

/**
 *
 */
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

/**
 *
 */
export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
