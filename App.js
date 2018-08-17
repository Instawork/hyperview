import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Button,
  Easing,
  FlatList,
  SectionList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import VisibilityDetectingView from './VisibilityDetectingView.js';
import { Font } from 'expo';
import { createStackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import { DOMParser, XMLSerializer } from 'xmldom';

//const ROOT = 'http://192.168.7.20:8080';
//const ROOT = 'http://10.1.10.14:8080';
const ROOT = 'http://127.0.0.1:8080';


const ROUTE_KEYS = {
};


function later(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}


/**
 * STATEFUL COMPONENTS
 */
class HVFlatList extends React.Component {
  constructor(props) {
    super(props);
    this.parser = new DOMParser();
    this.state = {
      refreshing: false,
    };
  }

  refresh() {
    const { element, onUpdate } = this.props;
    this.setState({refreshing: true});
    const path = element.getAttribute('href');
    const action = element.getAttribute('action') || 'append';
    const targetId = element.getAttribute('target') || null;
    const showIndicatorIds = element.getAttribute('show-during-load') || null;
    const hideIndicatorIds = element.getAttribute('hide-during-load') || null;
    const delay = element.getAttribute('delay');
    const once = element.getAttribute('once') || null;

    onUpdate(path, action, element, {
      targetId,
      showIndicatorIds,
      hideIndicatorIds,
      delay,
      once,
      onEnd: () => {
        this.setState({refreshing: false});
      }
    });
  }

  render() {
    const { refreshing } = this.state;
    const { element, navigation, stylesheet, animations, onUpdate } = this.props;
    const styleAttr = element.getAttribute('style');
    const style = styleAttr ? styleAttr.split(',').map((s) => stylesheet[s]) : null;

    const listProps = {
      style,
      data: element.getElementsByTagName('item'),
      keyExtractor: (item, index) => {
        return item.getAttribute('key');
      },
      renderItem: ({ item }) => {
        return renderElement(item, navigation, stylesheet, animations, onUpdate );
      },
    };

    let refreshProps = {};
    if (element.getAttribute('trigger') === 'refresh') {
      refreshProps = {
        onRefresh: () => { this.refresh() },
        refreshing,
      };
    }

    return React.createElement(
      FlatList,
      Object.assign(listProps, refreshProps),
    );
  }
}


/**
 * STATEFUL COMPONENTS
 */
class HVSectionList extends React.Component {
  constructor(props) {
    super(props);
    this.parser = new DOMParser();
    this.state = {
      refreshing: false,
    };
  }

  refresh() {
    const { element, onUpdate } = this.props;
    this.setState({refreshing: true});
    const path = element.getAttribute('href');
    const action = element.getAttribute('action') || 'append';
    const targetId = element.getAttribute('target') || null;
    const showIndicatorIds = element.getAttribute('show-during-load') || null;
    const hideIndicatorIds = element.getAttribute('hide-during-load') || null;
    const delay = element.getAttribute('delay');
    const once = element.getAttribute('once') || null;

    onUpdate(path, action, element, {
      targetId,
      showIndicatorIds,
      hideIndicatorIds,
      delay,
      once,
      onEnd: () => {
        this.setState({refreshing: false});
      }
    });
  }

  render() {
    const { refreshing } = this.state;
    const { element, navigation, stylesheet, animations, onUpdate } = this.props;
    const styleAttr = element.getAttribute('style');
    const style = styleAttr ? styleAttr.split(',').map((s) => stylesheet[s]) : null;

    const sectionElements = element.getElementsByTagName('section');
    const sections = [];

    for (let i = 0; i < sectionElements.length; ++i) {
      const sectionElement = sectionElements.item(i);
      const itemElements = sectionElement.getElementsByTagName('item');
      const items = [];
      for (let j = 0; j < itemElements.length; ++j) {
        const itemElement = itemElements.item(j);
        items.push(itemElement);
      }
      const titleElement = sectionElement.getElementsByTagName('sectiontitle').item(0);
      sections.push({
        title: titleElement,
        data: items,
      });
    }

    const listProps = {
      style,
      sections,
      keyExtractor: (item, index) => {
        return item.getAttribute('key');
      },
      renderItem: ({ item, index, section }) => {
        return renderElement(item, navigation, stylesheet, animations, onUpdate );
      },
      renderSectionHeader: ({section: { title }}) => {
        return renderElement(title, navigation, stylesheet, animations, onUpdate );
      },
    };

    let refreshProps = {};
    if (element.getAttribute('trigger') === 'refresh') {
      refreshProps = {
        onRefresh: () => { this.refresh() },
        refreshing,
      };
    }

    return React.createElement(
      SectionList,
      Object.assign(listProps, refreshProps),
    );
  }
}


class HVTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  render() {
    const { element, navigation, stylesheet, animations, onUpdate } = this.props;
    const props = Object.assign(
      createProps(element, stylesheet, animations),
      {
        multiline: element.tagName == 'textarea',
      },
      {
        onFocus: () => this.setState({focused: true}),
        onBlur: () => this.setState({focused: false}),
      }
    );

    if (this.state.focused && props.focusStyles) {
      props.style = props.focusStyles.split(',').map((s) => stylesheet[s]);
    }

    const input = React.createElement(
      TextInput,
      props,
    );

    const labelElement = getFirstTag(element, 'label');
    const helpElement = getFirstTag(element, 'help');

    const label = labelElement ? text(labelElement, navigation, stylesheet, animations, onUpdate) : null;
    const help = helpElement ? text(helpElement, navigation, stylesheet, animations, onUpdate) : null;

    let outerStyles = null;
    if (props.outerStyles) {
      outerStyles = props.outerStyles.split(',').map((s) => stylesheet[s]);
    }

    return React.createElement(
      View,
      {style: outerStyles},
      label,
      input,
      help
    );
  }
}


class HyperRef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };

    this.parser = new DOMParser();

    this.triggerPropNames = {
      'press': 'onPress',
      'longPress': 'onLongPress',
      'pressIn': 'onPressIn',
      'pressOut': 'onPressOut',
    };

    this.pressTriggers = ['press', 'longPress', 'pressIn', 'pressOut'];
    this.navActions = ['push', 'new', 'back', 'navigate'];
    this.updateActions = ['replace', 'replace-inner', 'append', 'prepend'];
  }

  createActionHandler(element, navigation, onUpdate) {
    const action = element.getAttribute('action') || 'push';

    if (this.navActions.indexOf(action) >= 0) {
      return createNavHandler(element, navigation);
    }

    if (this.updateActions.indexOf(action) >= 0) {
      return() => {
        const path = element.getAttribute('href');
        const targetId = element.getAttribute('target') || null;
        const showIndicatorIds = element.getAttribute('show-during-load') || null;
        const hideIndicatorIds = element.getAttribute('hide-during-load') || null;
        const delay = element.getAttribute('delay');
        const once = element.getAttribute('once') || null;
        onUpdate(path, action, element, { targetId, showIndicatorIds, hideIndicatorIds, delay, once });
      }
    }
  }

  render() {
    const { refreshing } = this.state;
    const { element, navigation, stylesheet, animations, onUpdate } = this.props;

    const href = element.getAttribute('href');
    if (!href) {
      return renderElement(element, navigation, stylesheet, animations, onUpdate, {skipHref: true});
    }

    const trigger = element.getAttribute('trigger') || 'press';

    // Render pressable element
    if (this.pressTriggers.indexOf(trigger) >= 0) {
      const props = {
        // Component will use touchable opacity to trigger href.
        activeOpacity: 0.5,
      };
      const triggerPropName = this.triggerPropNames[trigger];
      // For now only navigate.
      props[triggerPropName] = this.createActionHandler(element, navigation, onUpdate);

      return React.createElement(
        TouchableOpacity,
        props,
        renderElement(element, navigation, stylesheet, animations, onUpdate, {skipHref: true}),
      );
    }

    if (trigger == 'visible') {
      return React.createElement(
        VisibilityDetectingView,
        {
          onVisible: this.createActionHandler(element, navigation, onUpdate),
        },
        renderElement(element, navigation, stylesheet, animations, onUpdate, {skipHref: true})
      );
    }

    if (trigger == 'refresh') {
      const refreshControl = React.createElement(
        RefreshControl,
        { refreshing, onRefresh: this.createActionHandler(element, navigation, onUpdate) },
      );
      return React.createElement(
        ScrollView,
        { refreshControl },
        renderElement(element, navigation, stylesheet, animations, onUpdate, {skipHref: true})
      );
    }

    if (trigger == 'load') {
      return renderElement(element, navigation, stylesheet, animations, onUpdate, {skipHref: true})
    }

    return null;
  }

  componentDidMount() {
    const { element, navigation, onUpdate } = this.props;
    const href = element.getAttribute('href');
    const trigger = element.getAttribute('trigger');
    if (href && trigger == 'load') {
      const handler = this.createActionHandler(element, navigation, onUpdate);
      handler();
    }
  }
}


function addHref(component, element, navigation, stylesheet, animations, onUpdate ) {
  const href = element.getAttribute('href');
  if (!href) {
    return component;
  }

  return React.createElement(
    HyperRef,
    { element, navigation, stylesheet, animations, onUpdate },
    ...renderChildren(element, navigation, stylesheet, animations, onUpdate)
  );
}


/**
 * UTILITIES
 */
function getHrefKey(href) {
  return href.split('?')[0];
}

function getFirstTag(rootNode, tagName) {
  elements = rootNode.getElementsByTagName(tagName);
  if (elements  && elements[0]) {
    return elements[0];
  }
  return null;
}


/**
 *
 */
function createProps(element, stylesheet, animations) {
  const numericRules = [
    'numberOfLines',
  ];
  const booleanRules = [
    'multiline',
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
    } else if (booleanRules.indexOf(attr.name) >= 0) {
      props[attr.name] = attr.value == 'true';
    } else {
      props[attr.name] = attr.value;
    }
  }
  if (props.style) {
    props.style = props.style.split(',').map((s) => stylesheet[s]);
  }
  if (props.animatedValues) {
    const values = props.animatedValues.split(',').forEach((v) => {
      const value = animations.values[v];
      const property = animations.properties[v];
      if (value !== undefined && property !== undefined) {
        const animatedStyle = {};
        animatedStyle[property] = value;
        props.style = props.style || [];
        props.style.push(animatedStyle);
      }
    });
  }
  return props;
}

/**
 *
 */
function createNavHandler(element, navigation) {
  let navHandler = null;
  const href = element.getAttribute('href');
  const action = element.getAttribute('action');
  const showIndicatorId = element.getAttribute('show-during-load');
  const delay = element.getAttribute('delay');

  if (!href) {
    return navHandler;
  }

  let navFunction = navigation.push;
  let navRoute = 'Stack';
  let key = null;

  if (action == 'push') {
    // push a new screen on the stack
    navFunction = navigation.push;
  } else if (action == 'replace') {
    // replace current screen
    navFunction = navigation.replace;
  } else if (action == 'navigate') {
    // Return to the screen, if it exists
    navFunction = navigation.navigate;
    key = ROUTE_KEYS[getHrefKey(href)];
  } else if (action == 'new') {
    navRoute = 'Modal';
  }

  if (action == 'back') {
    navHandler = () => navigation.goBack();
  } else {
    navHandler = () => {
      console.log('navigating to ', key, 'href: ', href, 'indicator id: ', showIndicatorId);
      let preloadScreen = null;
      if (showIndicatorId) {
        const rootElement = element.ownerDocument;
        const screens = rootElement.getElementsByTagName('screen');
        preloadScreen = Array.from(screens).find((s) => s.getAttribute('id') == showIndicatorId);
      }
      navFunction(
        navRoute,
        {
          href,
          preloadScreen,
          delay,
        },
        {},
        key
      );
    }
  }

  return navHandler;
}

/**
 *
 */
function body(element, navigation, stylesheet, animations, onUpdate) {
  const props = createProps(element, stylesheet, animations);
  let component = props.animations ? Animated.View : View;
  if (element.getAttribute('scroll')) {
    component = props.animated ? Animated.ScrollView : ScrollView;
  }

  return React.createElement(
    component,
    props,
    ...renderChildren(element, navigation, stylesheet, animations, onUpdate)
  );
}

/**
 *
 */
function image(element, navigation, stylesheet, animations, onUpdate) {
  const imageProps = {};
  if (element.getAttribute('source')) {
    let source = element.getAttribute('source');
    if (!source.startsWith('http')) {
      source = ROOT + source;
    }
    imageProps.source = { uri: source };
  }
  const props = Object.assign(
    createProps(element, stylesheet, animations),
    imageProps
  );
  return React.createElement(
    props.animations ? Animated.Image : Image,
    props
  );
}

/**
 *
 */
function input(element, navigation, stylesheet, animations, onUpdate) {
  return React.createElement(
    HVTextInput,
    { element, navigation, stylesheet, animations, onUpdate }
  );
}

/**
 *
 */
function view(element, navigation, stylesheet, animations, onUpdate, options) {
  const { skipHref } = options || {};
  const props = createProps(element, stylesheet, animations);
  const scrollable = element.getAttribute('scroll');
  let c = View;
  if (props.animations) {
    if (scrollable) {
      c = Animated.ScrollView;
    } else {
      c = Animated.View;
    }
  } else {
    if (scrollable) {
      c = ScrollView;
    } else {
      c = View;
    }
  }

  let component = React.createElement(
    c,
    props,
    ...renderChildren(element, navigation, stylesheet, animations, onUpdate)
  );
  return skipHref ? component : addHref(component, element, navigation, stylesheet, animations, onUpdate);
}

/**
 *
 */
function list(element, navigation, stylesheet, animations, onUpdate) {
  return React.createElement(
    HVFlatList,
    { element, navigation, stylesheet, animations, onUpdate },
  );
}

/**
 *
 */
function sectionlist(element, navigation, stylesheet, animations, onUpdate) {
  return React.createElement(
    HVSectionList,
    { element, navigation, stylesheet, animations, onUpdate },
  );
}


/**
 *
 */
function spinner(element, navigation, stylesheet, animations, onUpdate) {
  const color = element.getAttribute('color') || undefined;
  return React.createElement(
    ActivityIndicator,
    { color },
  );
}

/**
 *
 */
function text(element, navigation, stylesheet, animations, onUpdate, options) {
  const { skipHref } = options || {};
  const props = createProps(element, stylesheet, animations);
  let component = React.createElement(
    props.animations? Animated.Text : Text,
    props,
    ...renderChildren(element, navigation, stylesheet, animations, onUpdate)
  );

  return skipHref ? component : addHref(component, element, navigation, stylesheet, animations, onUpdate);
}

/**
 *
 */
function renderChildren(element, navigation, stylesheet, animations, onUpdate) {
  const children = [];
  if (element.childNodes !== null) {
    for (let i = 0; i < element.childNodes.length; ++i) {
      let e = renderElement(element.childNodes.item(i), navigation, stylesheet, animations, onUpdate);
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
function renderElement(element, navigation, stylesheet, animations, onUpdate, options) {

  if (element.nodeType == 1) {
    if (element.getAttribute('hide') == 'true') {
      return null;
    }
  }

  switch (element.tagName) {
    case 'body':
      return body(element, navigation, stylesheet, animations, onUpdate); 
    case 'image':
      return image(element, navigation, stylesheet, animations, onUpdate); 
    case 'input':
    case 'textarea':
      return input(element, navigation, stylesheet, animations, onUpdate); 
    case 'text':
    case 'label':
    case 'help':
      return text(element, navigation, stylesheet, animations, onUpdate, options); 
    case 'view':
    case 'header':
    case 'item':
    case 'sectiontitle':
      return view(element, navigation, stylesheet, animations, onUpdate, options); 
    case 'list':
      return list(element, navigation, stylesheet, animations, onUpdate); 
    case 'sectionlist':
      return sectionlist(element, navigation, stylesheet, animations, onUpdate); 
    case 'spinner':
      return spinner(element, navigation, stylesheet, animations, onUpdate); 
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
function createAnimations(element) {
  const animatedValues = {};
  const animatedTimings = {};
  const animatedProperties = {};
  const returnValue = {
    values: animatedValues,
    timings: animatedTimings,
    properties: animatedProperties,
  };

  if (!element) {
    return returnValue;
  }

  const animated = getFirstTag(element, 'animated');
  if (!animated) {
    return returnValue;
  }

  const childElements = Array.from(animated.childNodes).filter((n) => n.nodeType == 1) || [];

  const valueElements = childElements.filter((e) => e.tagName == 'value');
  const animationElements = childElements.filter((e) => e.tagName == 'animation');

  valueElements.forEach((v) => {
    const id = v.getAttribute('id');
    const fromValue = parseInt(v.getAttribute('from'));
    const property = v.getAttribute('property');
    animatedValues[id] = new Animated.Value(fromValue);
    animatedProperties[id] = property;
  });

  animationElements.forEach((v) => {
    const id = v.getAttribute('id');
    animatedTimings[id] = createAnimation(v, animatedValues);
  });
  return returnValue;
}

function createAnimation(element, animatedValues) {
  const type = element.getAttribute('type');

  if (type == 'sequence' || type == 'parallel') {
    const animations = Array.from(element.childNodes).filter((n) => n.nodeType == 1).map((e) => {
      return createAnimation(e, animatedValues);
    });
    let animation = type == 'sequence' ? Animated.sequence(animations) : Animated.parallel(animations);
    if (element.getAttribute('loop')) {
      animation = Animated.loop(animation);
    }
    return animation;

  } else if (type == 'delay') {
    const duration = parseInt(element.getAttribute('duration'));
    return Animated.delay(duration);
  } else {
    const value = element.getAttribute('value');
    const toValue = parseFloat(element.getAttribute('to'));
    const duration = parseInt(element.getAttribute('duration'));
    const delay = parseInt(element.getAttribute('delay'));
    const easingFunc = element.getAttribute('easing') || 'linear';
    const easing = Easing[easingFunc]();
    return Animated.timing(
      animatedValues[value],
      {
        toValue,
        duration,
        delay,
        easing,
      }
    );
  }

  return null;
}

/**
 *
 */
class HyperScreen extends React.Component {
  constructor(props){
    super(props);
    this.parser = new DOMParser();
    this.serializer = new XMLSerializer();
    this.needsLoad = false;
    this.state = {
      styles: null,
      doc: null,
      path: null,
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.shallowClone = this.shallowClone.bind(this);
    this.shallowCloneToRoot = this.shallowCloneToRoot.bind(this);
  }

  componentDidMount() {
    const path = this.props.navigation.getParam('href', null);
    const preloadScreen = this.props.navigation.getParam('preloadScreen');
    const preloadStyles = preloadScreen ? createStylesheet(preloadScreen) : null;
    const animations = createAnimations(preloadScreen);

    this.needsLoad = true;
    if (preloadScreen) {
      this.setState({
        doc: preloadScreen,
        styles: preloadStyles,
        path,
        animations,
      });
    } else {
      this.setState({
        path: path,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const newHref = nextProps.navigation.state.params.href;
    const oldHref = this.props.navigation.state.params.href;

    if (newHref != oldHref) {
      const preloadScreen = nextProps.navigation.getParam('preloadScreen');
      const stylesheet = preloadScreen ? createStylesheet(preloadScreen) : null;
      const animations = createAnimations(preloadScreen);
      this.needsLoad = true;

      Object.entries(animations.timings).forEach(([key, timing]) => {
        timing.start();
      });

      this.setState({
        doc: preloadScreen,
        styles: stylesheet,
        animations: animations,
        path: newHref,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.needsLoad) {
      console.log('LOADING: ', this.state.path);
      this.load(this.state.path);
      this.needsLoad = false;
    }
  }

  fetchElement(href, root) {
    if (href.startsWith('#')) {
      return new Promise((resolve, reject) => {
        const element = root.getElementById(href.slice(1));
        if (element) {
          resolve(element.cloneNode(true));
        }
        reject();
      });
    }

    const url = ROOT + href;
    return fetch(
      url,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': 0
        }
      })
      .then((response) => response.text())
      .then((responseText) => this.parser.parseFromString(responseText).documentElement);
  }

  // UPDATE FRAGMENTS ON SCREEN
  onUpdate(href, action, currentElement, opts) {
    const options = opts || {};
    const { targetId, showIndicatorIds, hideIndicatorIds, delay, once, onEnd } = options;
    const serializer = new XMLSerializer();

    const url = ROOT + href;

    if (once && currentElement.getAttribute('ran-once')) {
      // This action is only supposed to run once, and it already ran,
      // so there's nothing more to do.
      onEnd && onEnd();
      return;
    }

    let newRoot = this.state.doc;
    let changedIndicator = false;

    // Update the DOM to show some indicators during the request.
    if (showIndicatorIds) {
      showIndicatorIds.split(' ').forEach((id) => {
        const el = newRoot.getElementById(id);
        if (el) {
          el.setAttribute('hide', 'false');
          newRoot = this.shallowCloneToRoot(el.parentNode);
          changedIndicator = true;
        }
      });
    }

    // Update the DOM to hide some indicators during the request.
    if (hideIndicatorIds) {
      hideIndicatorIds.split(' ').forEach((id) => {
        const el = newRoot.getElementById(id);
        if (el) {
          el.setAttribute('hide', 'true');
          newRoot = this.shallowCloneToRoot(el.parentNode);
          changedIndicator = true;
        }
      });
    }

    if (changedIndicator) {
      this.setState({
        doc: newRoot,
      });
    }

    const fetchPromise = () => this.fetchElement(href, newRoot)
      .then((newElement) => {

        if (once) {
          // If the action is only supposed to run once, set an attribute indicating
          // that it already ran, so that it won't run again next time the action is triggered.
          currentElement.setAttribute('ran-once', 'true');
          newRoot = this.shallowCloneToRoot(currentElement.parentNode);
        }

        // If a target is specified and exists, use it. Otherwise, the action target defaults
        // to the element triggering the action.
        let targetElement = targetId ? newRoot.getElementById(targetId) : currentElement;
        if (!targetElement) {
          targetElement = currentElement;
        }

        if (action == 'replace') {
          const parentElement = targetElement.parentNode;
          parentElement.replaceChild(newElement, targetElement);
          newRoot = this.shallowCloneToRoot(parentElement);
        }

        if (action == 'replace-inner') {
          let child = targetElement.firstChild;
          // Remove the target's children
          while (child !== null) {
            let nextChild = child.nextSibling;
            targetElement.removeChild(child);
            child = nextChild;
          }
          targetElement.appendChild(newElement);
          newRoot = this.shallowCloneToRoot(targetElement);
        }

        if (action == 'append') {
          targetElement.appendChild(newElement);
          newRoot = this.shallowCloneToRoot(targetElement);
        }

        if (action == 'prepend') {
          targetElement.insertBefore(newElement, targetElement.firstChild);
          newRoot = this.shallowCloneToRoot(targetElement);
        }

        // Update the DOM to hide the indicators shown during the request.
        if (showIndicatorIds) {
          showIndicatorIds.split(' ').forEach((id) => {
            const el = newRoot.getElementById(id);
            if (el) {
              el.setAttribute('hide', 'true');
              newRoot = this.shallowCloneToRoot(el.parentNode);
              changedIndicator = true;
            }
          });
        }

        // Update the DOM to show the indicators hidden during the request.
        if (hideIndicatorIds) {
          hideIndicatorIds.split(' ').forEach((id) => {
            const el = newRoot.getElementById(id);
            if (el) {
              el.setAttribute('hide', 'false');
              newRoot = this.shallowCloneToRoot(el.parentNode);
              changedIndicator = true;
            }
          });
        }

        this.setState({
          doc: newRoot,
        });

        onEnd && onEnd();
      }
    );

    if (delay) {
      later(delay).then(fetchPromise);
    } else {
      fetchPromise();
    }
  }

  /**
   * Clones the element and moves all children from the original element
   * to the clone. The returned element will be a new object, but all of the child
   * nodes will be existing objects.
   */
  shallowClone(element) {
    const newElement = element.cloneNode(false);
    let childNode = element.firstChild;
    while (childNode !== null) {
      let nextChild = childNode.nextSibling;
      newElement.appendChild(childNode);
      childNode = nextChild;
    }
    return newElement;
  }

  /**
   * Clones all elements from the given element up to the root of the DOM.
   * Returns the new root object. Essentially, this produces a new DOM object
   * that re-uses as many existing nodes as possible.
   */
  shallowCloneToRoot(element) {
    const elementClone = this.shallowClone(element);
    if (element.nodeType == 9) {
      return elementClone;
    }
    element.parentNode.replaceChild(elementClone, element);
    const parentClone = this.shallowCloneToRoot(element.parentNode);
    return parentClone;
  }

  load() {
    const delay = this.props.navigation.getParam('delay');
    const path = this.state.path;

    const url = ROOT + path;
    const fetchPromise = () => fetch(url, {headers: {'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': 0}})
      .then((response) => response.text())
      .then((responseText) => {
        const doc = this.parser.parseFromString(responseText);
        const animations = createAnimations(doc);
        const stylesheet = createStylesheet(doc);
        ROUTE_KEYS[getHrefKey(path)] = this.props.navigation.state.key;

        Object.entries(animations.timings).forEach(([key, timing]) => {
          timing.start();
        });

        this.setState({
          doc: doc,
          styles: stylesheet,
          animations: animations,
        });
      });

    if (delay) {
      later(delay).then(fetchPromise);
    } else {
      fetchPromise();
    }
  }

  render() {
    if(!this.state.doc) {
      return (
        <View style={{backgroundColor: 'white', flex: 1}}>
        </View>
      );
    }
    const body = this.state.doc.getElementsByTagName('body')[0];
    return renderElement(body, this.props.navigation, this.state.styles, this.state.animations, this.onUpdate);
  }
}

/**
 *
 */
const MainStack = createStackNavigator(
  {
    Stack: HyperScreen,
  },
  {
    initialRouteName: 'Stack',
    initialRouteParams: {
      //href: '/dynamic_elements/indicator.xml',
      href: '/index.xml',
    },
    headerMode: 'none',
  }
);

/**
 *
 */
const RootStack = createStackNavigator(
  {
    Main: MainStack,
    Modal: HyperScreen,
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
