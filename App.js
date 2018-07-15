import React from 'react';
import { Button, View, Image, Text, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { Font, MapView } from 'expo';
import { createStackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import { DOMParser } from 'xmldom';

const ROOT = 'http://192.168.7.20:8080';
//const ROOT = 'http://10.1.10.14:8080';


const ROUTE_KEYS = {
};

/**
 * UTILITIES
 */
function getHrefKey(href) {
  return href.split('?')[0];
}


/**
 *
 */
function createProps(element, stylesheet) {
  const numericRules = [
    'numberOfLines',
  ];

  const props = {};
  if (element.attributes === null) {
    return props;
  }
  for (let i = 0; i < element.attributes.length; ++i) {
    let attr = element.attributes.item(i);
    if (numericRules.indexOf(attr.name) >= 0) {
      let intValue = parseInt(attr.value, 10);
      props[attr.name] = intValue || 0;
    } else {
      props[attr.name] = attr.value;
    }
  }
  if (props.styles) {
    props.style = props.styles.split(',').map((s) => stylesheet[s]);
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

  if (!href) {
    return props;
  }

  let navFunction = navigation.push;
  let navRoute = 'Stack';
  let key = null;

  if (target == 'push') {
    // push a new screen on the stack
    navFunction = navigation.push;
  } else if (target == 'replace') {
    // replace current screen
    navFunction = navigation.replace;
  } else if (target == 'navigate') {
    // Return to the screen, if it exists
    navFunction = navigation.navigate;
    key = ROUTE_KEYS[getHrefKey(href)];
  } else if (target == 'modal') {
    navRoute = 'Modal';
  }

  if (target == 'back') {
    props['onPress'] = () => navigation.goBack();
  } else {
    props['onPress'] = () => {
      console.log('navigating to ', key, 'href: ', href);
      navFunction(
        navRoute,
        {
          href,
        },
        {},
        key
      );
    }
  }

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
function map(element, navigation, stylesheet) {
  const mapProps = {};
  const geocode = element.getAttribute('geocode');
  if (geocode) {
    const parts = geocode.split(',');
    mapProps.initialRegion = {
      latitude: parseFloat(parts[0]),
      longitude: parseFloat(parts[1]),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }

  const props = Object.assign(
    createProps(element, stylesheet),
    mapProps
  );
  return React.createElement(
    MapView,
    props,
    ...renderChildren(element, navigation, stylesheet)
  );
}

/**
 *
 */
function mapMarker(element, navigation, stylesheet) {
  const mapProps = {};
  const geocode = element.getAttribute('geocode');
  if (geocode) {
    const parts = geocode.split(',');
    mapProps.coordinate = {
      latitude: parseFloat(parts[0]),
      longitude: parseFloat(parts[1]),
    };
  }

  const props = Object.assign(
    createProps(element, stylesheet),
    mapProps
  );
  return React.createElement(
    MapView.Marker,
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

  headerComponent = renderElement(
    header,
    navigation,
    stylesheet,
  );

  navigation.setParams({
    headerComponent,
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
    case 'header':
      return view(element, navigation, stylesheet); 
    case 'map':
      return map(element, navigation, stylesheet); 
    case 'map-marker':
      return mapMarker(element, navigation, stylesheet); 
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
  const numericRules = [
    'borderBottomWidth',
    'borderLeftWidth',
    'borderRadius',
    'borderRightWidth',
    'borderTopWidth',
    'borderWidth',
    'flex',
    'flexGrow',
    'flexShrink',
    'fontSize',
    'height',
    'lineHeight',
    'margin',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'padding',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'width',
    "top",
    "bottom",
    "left",
    "right",
  ];
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
          if (numericRules.indexOf(attr.name) >= 0) {
            let intValue = parseInt(attr.value, 10);
            ruleStyles[attr.name] = intValue || 0;
          } else {
            ruleStyles[attr.name] = attr.value;
          }
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
    const header = navigation.getParam('headerComponent');
    const headerRight = navigation.getParam('headerRight');
    const headerLeft = navigation.getParam('headerLeft');
    const options = {
      header,
      headerRight,
    };
    if (headerLeft) {
      options.headerLeft = headerLeft;
    }
    return options;
  }

  constructor(props){
    super(props);
    this.parser = new DOMParser();
    this.isMounted = false;
    this.state = {
      isLoading: true,
      styles: null,
      doc: null,
      path: null,
    };
  }

  componentDidMount() {
    this.isMounted = true;
    const path = this.props.navigation.getParam('href', null);
    console.log('load on mount: ', path);
    this.load(path);
  }

  componentDidUpdate(prevProps, prevState) {
    const newHref = this.props.navigation.state.params.href
    const oldHref = prevProps.navigation.state.params.href;
    if (newHref != oldHref) {
      console.log('load on change: ', newHref, oldHref);
      this.load(newHref);
    }
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  load(path) {
    const url = ROOT + path;
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const doc = this.parser.parseFromString(responseText);
        const stylesheet = createStylesheet(doc);
        const header = renderHeader(doc, this.props.navigation, stylesheet);
        this.props.navigation.setParams({ header });
        ROUTE_KEYS[getHrefKey(path)] = this.props.navigation.state.key;
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
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'HKGrotesk-Bold': require('./assets/fonts/HKGrotesk-Bold.otf'),
      'HKGrotesk-SemiBold': require('./assets/fonts/HKGrotesk-SemiBold.otf'),
      'HKGrotesk-Medium': require('./assets/fonts/HKGrotesk-Medium.otf'),
      'HKGrotesk-Regular': require('./assets/fonts/HKGrotesk-Regular.otf'),
      'HKGrotesk-Light': require('./assets/fonts/HKGrotesk-Light.otf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    if (!this.state.fontLoaded) {
      return null;
    }
    return <RootStack />;
  }
}
