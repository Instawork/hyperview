/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Components from 'hyperview/src/services/components';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Easing,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DOMParser, XMLSerializer } from 'xmldom';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import React from 'react';
import VisibilityDetectingView from './VisibilityDetectingView.js';
import { createProps, getFirstTag } from 'hyperview/src/services';
import { version } from '../package.json';
import urlParse from 'url-parse';

const AMPLITUDE_NS = Namespaces.AMPLITUDE;
const HYPERVIEW_ALERT_NS = Namespaces.HYPERVIEW_ALERT;
const HYPERVIEW_NS = Namespaces.HYPERVIEW;
const INTERCOM_NS = Namespaces.INTERCOM;
const PHONE_NS = Namespaces.PHONE;
const REDUX_NS = Namespaces.REDUX;
const SHARE_NS = Namespaces.SHARE;
const SMS_NS = Namespaces.SMS;

const ROUTE_KEYS = {};
const PRELOAD_SCREEN = {};

const HYPERVIEW_VERSION = version;

function uid() {
  return Date.now(); // Not trully unique but sufficient for our use-case
}

function later(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

function getHyperviewHeaders() {
  const { width, height } = Dimensions.get('window');
  return {
    'X-Hyperview-Version': HYPERVIEW_VERSION,
    'X-Hyperview-Dimensions': `${width}w ${height}h`,
  };
}

/**
 * STATEFUL COMPONENTS
 */



/**
 * Component that handles dispatching behaviors based on the appropriate
 * triggers.
 */
class HyperRef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      pressed: false,
    };

    this.pressTriggerPropNames = {
      press: 'onPress',
      longPress: 'onLongPress',
      pressIn: 'onPressIn',
      pressOut: 'onPressOut',
    };

    this.pressTriggers = ['press', 'longPress', 'pressIn', 'pressOut'];
    this.navActions = ['push', 'new', 'back', 'close', 'navigate'];
    this.updateActions = ['replace', 'replace-inner', 'append', 'prepend'];
  }

  createActionHandler = (element, behaviorElement, onUpdate) => {
    const action = behaviorElement.getAttribute('action') || 'push';

    if (this.navActions.indexOf(action) >= 0) {
      return () => {
        const href = behaviorElement.getAttribute('href');
        const showIndicatorId = behaviorElement.getAttribute('show-during-load');
        const delay = behaviorElement.getAttribute('delay');
        onUpdate(href, action, element, { showIndicatorId, delay });
      };
    } else if (this.updateActions.indexOf(action) >= 0) {
      return () => {
        const href = behaviorElement.getAttribute('href');
        const verb = behaviorElement.getAttribute('verb');
        const targetId = behaviorElement.getAttribute('target');
        const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
        const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
        const delay = behaviorElement.getAttribute('delay');
        const once = behaviorElement.getAttribute('once');
        onUpdate(
          href, action, element,
          { verb, targetId, showIndicatorIds, hideIndicatorIds, delay, once },
        );
      };
    }
    //
    // Custom behavior
    return () => onUpdate(null, action, element, { custom: true, behaviorElement });
  }

  render() {
    const { refreshing, pressed } = this.state;
    const { element, stylesheets, onUpdate, options } = this.props;
    const behaviorElements = getBehaviorElements(element);
    const pressBehaviors = behaviorElements.filter(e => this.pressTriggers.indexOf(e.getAttribute('trigger') || 'press') >= 0);
    const visibleBehaviors = behaviorElements.filter(e => e.getAttribute('trigger') === 'visible');
    const refreshBehaviors = behaviorElements.filter(e => e.getAttribute('trigger') === 'refresh');

    // Render the component based on the XML element. Depending on the applied behaviors,
    // this component will be wrapped with others to provide the necessary interaction.
    let renderedComponent = Render.renderElement(
      element, stylesheets, onUpdate, { ...options, pressed, skipHref: true },
    );

    const styleAttr = element.getAttribute('href-style');
    const hrefStyle = styleAttr ? styleAttr.split(' ').map(s => stylesheets.regular[s]) : null;

    // Render pressable element
    if (pressBehaviors.length > 0) {
      const props = {
        // Component will use touchable opacity to trigger href.
        activeOpacity: 1,
        style: hrefStyle,
      };

      // With multiple behaviors for the same trigger, we need to stagger
      // the updates a bit so that each update operates on the latest DOM.
      // Ideally, we could apply multiple DOM updates at a time.
      let time = 0;

      pressBehaviors.forEach((behaviorElement) => {
        const trigger = behaviorElement.getAttribute('trigger') || 'press';
        const triggerPropName = this.pressTriggerPropNames[trigger];
        const handler = this.createActionHandler(element, behaviorElement, onUpdate);
        if (props[triggerPropName]) {
          const oldHandler = props[triggerPropName];
          props[triggerPropName] = () => {
            oldHandler();
            setTimeout(handler, time);
            time += 1;
          };
        } else {
          props[triggerPropName] = handler;
        }
      });

      if (props.onPressIn) {
        const oldHandler = props.onPressIn;
        props.onPressIn = () => {
          this.setState({ pressed: true });
          oldHandler();
        };
      } else {
        props.onPressIn = () => {
          this.setState({ pressed: true });
        };
      }

      if (props.onPressOut) {
        const oldHandler = props.onPressOut;
        props.onPressOut = () => {
          this.setState({ pressed: false });
          oldHandler();
        };
      } else {
        props.onPressOut = () => {
          this.setState({ pressed: false });
        };
      }

      // Fix a conflict between onPressOut and onPress triggering at the same time.
      if (props.onPressOut && props.onPress) {
        const onPressHandler = props.onPress;
        props.onPress = () => {
          setTimeout(onPressHandler, time);
        };
      }

      renderedComponent = React.createElement(
        TouchableOpacity,
        props,
        renderedComponent,
      );
    }

    // Wrap component in a scrollview with a refresh control to trigger
    // the refresh behaviors.
    if (refreshBehaviors.length > 0) {
      const refreshHandlers = refreshBehaviors.map(behaviorElement =>
        this.createActionHandler(element, behaviorElement, onUpdate),
      );
      const onRefresh = () => refreshHandlers.forEach(h => h());

      const refreshControl = React.createElement(
        RefreshControl,
        { refreshing, onRefresh },
      );
      renderedComponent = React.createElement(
        ScrollView,
        { refreshControl, style: hrefStyle },
        renderedComponent,
      );
    }

    // Wrap component in a VisibilityDetectingView to trigger visibility behaviors.
    if (visibleBehaviors.length > 0) {
      const visibleHandlers = visibleBehaviors.map(behaviorElement =>
        this.createActionHandler(element, behaviorElement, onUpdate),
      );
      const onVisible = () => visibleHandlers.forEach(h => h());

      renderedComponent = React.createElement(
        VisibilityDetectingView,
        { onVisible, style: hrefStyle },
        renderedComponent,
      );
    }

    return renderedComponent;
  }

  componentDidUpdate(prevProps) {
    const { element, onUpdate } = this.props;
    if (prevProps.element === element) {
      return;
    }
    const behaviorElements = getBehaviorElements(element);
    const loadBehaviors = behaviorElements.filter(e => e.getAttribute('trigger') === 'load');
    loadBehaviors.forEach((behaviorElement) => {
      const handler = this.createActionHandler(element, behaviorElement, onUpdate);
      setTimeout(handler, 0);
    });
  }

  componentDidMount() {
    const { element, onUpdate } = this.props;
    const behaviorElements = getBehaviorElements(element);
    const loadBehaviors = behaviorElements.filter(e => e.getAttribute('trigger') === 'load');

    loadBehaviors.forEach((behaviorElement) => {
      const handler = this.createActionHandler(element, behaviorElement, onUpdate);
      setTimeout(handler, 0);
    });
  }
}

function addHref(component, element, stylesheets, onUpdate, options) {
  const href = element.getAttribute('href');
  const behaviorElements = getChildElementsByTagName(element, 'behavior');
  const hasBehaviors = href || behaviorElements.length > 0;
  if (!hasBehaviors) {
    return component;
  }

  return React.createElement(
    HyperRef,
    { element, stylesheets, onUpdate, options },
    ...Render.renderChildren(element, stylesheets, onUpdate, options),
  );
}

/**
 * UTILITIES
 */
function getHrefKey(href) {
  return href.split('?')[0];
}

/**
 * Searches the parent chain from the given element until it finds an
 * element with the given tag name. If no ancestor with the tagName is found,
 * returns null.
 */
function getAncestorByTagName(element, tagName) {
  let parentNode = element.parentNode;
  while (parentNode !== null && parentNode.tagName !== tagName) {
    parentNode = parentNode.parentNode || null;
  }
  return parentNode;
}

function getChildElementsByTagName(element, tagName) {
  return Array.from(element.childNodes).filter(n => n.nodeType === 1 && n.tagName === tagName);
}

/**
 * Returns array of all direct child nodes that are behavior elements. Additionally,
 * the element itself can be considered a behavior element if it has an href.
 */
function getBehaviorElements(element) {
  const behaviorElements = Array.from(element.childNodes).filter(n => n.tagName === 'behavior');
  if (element.getAttribute('href')) {
    behaviorElements.unshift(element);
  }
  return behaviorElements;
}

/**
 *
 */
export function image(element, stylesheets, onUpdate, options) {
  const { skipHref } = options || {};
  const imageProps = {};
  if (element.getAttribute('source')) {
    let source = element.getAttribute('source');
    source = urlParse(source, options.screenUrl, true).toString();
    imageProps.source = { uri: source };
  }
  const props = Object.assign(
    createProps(element, stylesheets, options),
    imageProps,
  );
  const component = React.createElement(
    Image,
    props,
  );
  return skipHref ?
    component :
    addHref(component, element, stylesheets, onUpdate, options);
}

/**
 *
 */
export function view(element, stylesheets, onUpdate, options) {
  let viewOptions = options;
  const { skipHref } = viewOptions || {};
  const props = createProps(element, stylesheets, viewOptions);
  const scrollable = !!element.getAttribute('scroll');
  let c = View;
  const inputRefs = [];
  if (scrollable) {
    const textFields = element.getElementsByTagNameNS(HYPERVIEW_NS, 'text-field');
    const textAreas = element.getElementsByTagNameNS(HYPERVIEW_NS, 'text-area');
    const hasFields = textFields.length > 0 || textAreas.length > 0;
    c = hasFields ? KeyboardAwareScrollView : ScrollView;
    if (hasFields) {
      props.extraScrollHeight = 32;
      props.keyboardOpeningTime = 0;
      props.keyboardShouldPersistTaps = 'handled';
      props.scrollEventThrottle = 16;
      props.getTextInputRefs = () => inputRefs;
      const registerInputHandler = ref => inputRefs.push(ref);
      viewOptions = { ...viewOptions, registerInputHandler };
    }
  }

  if (scrollable) {
    const scrollDirection = element.getAttribute('scroll-orientation');
    if (scrollDirection === 'horizontal') {
      props.horizontal = true;
    }
  }

  const component = React.createElement(
    c,
    props,
    ...Render.renderChildren(element, stylesheets, onUpdate, viewOptions),
  );
  return skipHref ?
    component :
    addHref(component, element, stylesheets, onUpdate, viewOptions);
}

/**
 *
 */
export function text(element, stylesheets, onUpdate, options) {
  const { skipHref } = options || {};
  const props = createProps(element, stylesheets, options);
  const component = React.createElement(
    Text,
    props,
    ...Render.renderChildren(element, stylesheets, onUpdate, options),
  );

  return skipHref ?
    component :
    addHref(component, element, stylesheets, onUpdate, options);
}

/**
 *
 */
export default class HyperScreen extends React.Component {
  static createProps = createProps;
  static renderChildren = Render.renderChildren;

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.shallowClone = this.shallowClone.bind(this);
    this.shallowCloneToRoot = this.shallowCloneToRoot.bind(this);
    this.reload = this.reload.bind(this);
    this.parseError = this.parseError.bind(this);

    this.navActions = ['push', 'new', 'back', 'close', 'navigate'];
    this.updateActions = ['replace', 'replace-inner', 'append', 'prepend'];

    this.parser = new DOMParser({
      locator: {},
      errorHandler: {
        warning: this.parseError,
        error: this.parseError,
        fatalError: this.parseError,
      },
    });
    this.serializer = new XMLSerializer();
    this.needsLoad = false;
    this.state = {
      styles: null,
      doc: null,
      url: null,
      error: false,
    };

    this.componentRegistry = Components.getRegistry(this.props.components);
  }

  /**
   * Callback for parser errors. Logs error to console and shows error screen.
   */
  parseError(e) {
    console.error(e);
    this.setState({
      doc: null,
      error: true,
    });
  }

  componentDidMount() {
    // The screen may be rendering via a navigation from another HyperScreen.
    // In this case, the url to load in the screen will be passed via navigation props.
    // Otherwise, use the entrypoint URL provided as a prop to the first HyperScreen.
    const url = this.props.navigation.state.params.url || this.props.entrypointUrl || null;

    const preloadScreen = this.props.navigation.state.params.preloadScreen
      ? PRELOAD_SCREEN[this.props.navigation.state.params.preloadScreen]
      : null;
    const preloadStyles = preloadScreen ? Stylesheets.createStylesheets(preloadScreen) : {};

    this.needsLoad = true;
    if (preloadScreen) {
      this.setState({
        doc: preloadScreen,
        styles: preloadStyles,
        error: false,
        url,
      });
    } else {
      this.setState({
        error: false,
        url,
      });
    }
  }

  /**
   * Potentially updates state when navigating back to the mounted screen.
   * If the navigation params have a different URL than the screen's URL, Update the
   * preload screen and URL to load.
   */
  componentWillReceiveProps(nextProps) {
    const newUrl = nextProps.navigation.state.params.url;
    const oldUrl = this.props.navigation.state.params.url;
    const newPreloadScreen = nextProps.navigation.state.params.preloadScreen;
    const oldPreloadScreen = this.props.navigation.state.params.preloadScreen;

    if (newPreloadScreen !== oldPreloadScreen) {
      delete PRELOAD_SCREEN[oldPreloadScreen];
    }

    // TODO: If the preload screen is changing, delete the old one from
    // PRELOAD_SCREENS to prevent memory leaks.

    if (newUrl !== oldUrl) {
      this.needsLoad = true;

      const preloadScreen = newPreloadScreen
        ? PRELOAD_SCREEN[newPreloadScreen]
        : null;

      const doc = preloadScreen || this.state.doc;
      const styles = preloadScreen ? Stylesheets.createStylesheets(preloadScreen) : this.state.styles;

      this.setState({ doc, styles, url: newUrl });
    }
  }

  /**
   * Clear out the preload screen associated with this screen.
   */
  componentWillUnmount() {
    const { preloadScreen } = this.props.navigation.state.params;
    if (preloadScreen && PRELOAD_SCREEN[preloadScreen]) {
      delete PRELOAD_SCREEN[preloadScreen];
    }
  }

  /**
   * Fetch data from the url if the screen should reload.
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.needsLoad) {
      this.load(this.state.url);
      this.needsLoad = false;
    }
  }

  /**
   * Performs a full load of the screen.
   */
  load = () => {
    const delay = this.props.navigation.state.params.delay;
    const url = this.state.url;

    const fetchPromise = () => this.props.fetch(url, { headers: getHyperviewHeaders() })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.text();
      })
      .then((responseText) => {
        let doc = this.parser.parseFromString(responseText);
        let error = false;
        const stylesheets = Stylesheets.createStylesheets(doc);
        ROUTE_KEYS[getHrefKey(url)] = this.props.navigation.state.key;

        // Make sure the XML has the required elements: <doc>, <screen>, <body>.
        const docElement = getFirstTag(doc, 'doc');
        if (!docElement) {
          console.error(`No <doc> tag found in the response from ${url}.`);
          doc = null;
          error = true;
        } else {
          const screenElement = getFirstTag(docElement, 'screen');
          if (!screenElement) {
            console.error(`No <screen> tag found in the <doc> tag from ${url}.`);
            doc = null;
            error = true;
          } else {
            const bodyElement = getFirstTag(screenElement, 'body');
            if (!bodyElement) {
              console.error(`No <body> tag found in the <screen> tag from ${url}.`);
              doc = null;
              error = true;
            }
          }
        }

        this.setState({
          doc,
          styles: stylesheets,
          error,
        });
      })
      .catch((reason) => {
        this.setState({
          error: true,
        });
        throw reason;
      });

    if (delay) {
      later(parseInt(delay, 10)).then(fetchPromise);
    } else {
      fetchPromise();
    }
  }

  /**
   * Reload if an error occured.
   */
  reload = () => {
    this.needsLoad = true;
    this.setState({
      error: false,
    });
  }

  /**
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  render() {
    const { doc, url, error } = this.state;
    if (error) {
      return (
        <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>An error occured</Text>
          <TouchableOpacity onPress={this.reload}>
            <Text style={{ color: '#4778FF', marginTop: 16 }}>Reload</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!doc) {
      return (
        <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    const body = doc.getElementsByTagNameNS(HYPERVIEW_NS, 'body')[0];
    return Render.renderElement(
      body,
      this.state.styles,
      this.onUpdate,
      {
        screenUrl: url,
        componentRegistry: this.componentRegistry,
      },
    );
  }

  /**
   * Returns a navigation object similar to the one provided by React Navigation,
   * but connected to props injected by the parent app.
   */
  getNavigation = () => ({
    back: this.props.back,
    push: this.props.push,
    replace: this.props.replace,
    navigate: this.props.navigate,
    openModal: this.props.openModal,
    closeModal: this.props.closeModal,
  })

  /**
   * Turns the href into a fetchable URL.
   * If the href is fully qualified, return it.
   * Otherwise, pull the protocol/domain/port from the screen's URL and append the href.
   */
  getUrlFromHref = (href) => {
    const rootUrl = urlParse(href, this.state.url, true);
    return rootUrl.toString();
  }

  /**
   * Fetches the provided reference.
   * - If the references is an id reference (starting with #),
   *   returns a clone of that element.
   * - If the reference is a full URL, fetches the URL.
   * - If the reference is a path, fetches the path from the host of the URL
   *   used to render the screen.
   * Returns a promise that resolves to a DOM element.
   */
  fetchElement = (href, verb, root, formData) => {
    verb = verb || 'GET';
    if (href.startsWith('#')) {
      return new Promise((resolve, reject) => {
        const element = root.getElementById(href.slice(1));
        if (element) {
          resolve(element.cloneNode(true));
        }
        reject();
      });
    }

    let url = this.getUrlFromHref(href);
    if (verb === 'GET' && formData) {
      // For GET requests, we can't include a body so we encode the form data as a query
      // string in the URL.
      const queryString = formData.getParts().map(
        e => `${encodeURIComponent(e.fieldName)}=${encodeURIComponent(e.string)}`).join('&');
      url = `${url}?${queryString}`;
    }
    const options = {
      method: verb,
      headers: getHyperviewHeaders(),
      // For non-GET requests, include the formdata as the body of the request.
      body: verb === 'GET' ? undefined : formData,
    };

    return this.props.fetch(url, options)
      .then(response => response.text())
      .then(responseText => this.parser.parseFromString(responseText).documentElement);
  }

  /**
   * Creates a FormData object for the given element. Finds the closest form element ancestor
   * and adds data for all inputs contained in the form. Returns null if the element has no
   * form ancestor.
   */
  getFormData = (element) => {
    const formElement = getAncestorByTagName(element, 'form');
    if (!formElement) {
      return null;
    }
    const formData = new FormData();
    ['text-area', 'text-field', 'select-single', 'select-multiple']
      // Get all inputs in the form
      .reduce((acc, tag) => (
        acc.concat(Array.from(formElement.getElementsByTagNameNS(HYPERVIEW_NS, tag)))
      ), [])
      // Append the form data for each input
      .forEach((input) => {
        const name = input.getAttribute('name');
        if (input.tagName === 'select-single' || input.tagName === 'select-multiple') {
          // Add each selected option to the form data
          Array.from(input.getElementsByTagNameNS(HYPERVIEW_NS, 'option'))
            .filter(opt => opt.getAttribute('selected') === 'true')
            .forEach(opt => formData.append(name, opt.getAttribute('value')));
        } else {
          // Add the text input to the form data
          formData.append(name, input.getAttribute('value'));
        }
      });
    return formData;
  }

  /**
   *
   */
  onUpdate = (href, action, currentElement, opts) => {
    if (action === 'reload') {
      this.reload();
    } else if (this.navActions.indexOf(action) >= 0) {
      this.onNavigate(href, action, currentElement, opts);
    } else if (this.updateActions.indexOf(action) >= 0) {
      this.onUpdateFragment(href, action, currentElement, opts);
    } else if (action === 'swap') {
      this.onSwap(currentElement, opts.newElement);
    } else {
      const { behaviorElement } = opts;
      this.onCustomUpdate(behaviorElement);
    }
  }

  /**
   *
   */
  onNavigate = (href, action, element, opts) => {
    const navigation = this.getNavigation();
    const { showIndicatorId, delay } = opts;

    let navFunction = navigation.push;
    let key = null;

    const url = this.getUrlFromHref(href);

    if (action === 'push') {
      // push a new screen on the stack
      navFunction = navigation.push;
    } else if (action === 'replace') {
      // replace current screen
      navFunction = navigation.replace;
    } else if (action === 'navigate') {
      // Return to the screen, if it exists
      navFunction = navigation.navigate;
      key = ROUTE_KEYS[getHrefKey(url)];
    } else if (action === 'new') {
      navFunction = navigation.openModal;
    } else if (action === 'close') {
      navFunction = navigation.closeModal;
    } else if (action === 'back') {
      navFunction = navigation.back;
    }

    const navHandler = () => {
      let preloadScreen = null;
      if (showIndicatorId) {
        const screens = this.state.doc.getElementsByTagNameNS(HYPERVIEW_NS, 'screen');
        preloadScreen = uid();
        PRELOAD_SCREEN[preloadScreen] = Array.from(screens).find(s => s.getAttribute('id') === showIndicatorId);
      }

      const routeParams = ((action === 'back' || action === 'close') && href === '#') ? undefined : { url, preloadScreen, delay };
      navFunction(routeParams, key);
    };

    navHandler();
  }

  /**
   * Handler for behaviors on the screen.
   * @param href {string} A reference to the XML to fetch. Can be local (via id reference prepended
   *        by #) or a
   * remote resource.
   * @param action {string} The name of the action to perform with the returned XML.
   * @param currentElement {Element} The XML DOM element triggering the behavior.
   * @param options {Object} Optional attributes:
   *  - verb: The HTTP method to use for the request
   *  - targetId: An id reference of the element to apply the action to. Defaults to currentElement
   *    if not provided.
   *  - showIndicatorIds: Space-separated list of id references to show during the fetch.
   *  - hideIndicatorIds: Space-separated list of id references to hide during the fetch.
   *  - delay: Minimum time to wait to fetch the resource. Indicators will be shown/hidden during
   *    this time.
   *  - once: If true, the action should only trigger once. If already triggered, onUpdate will be
   *    a no-op.
   *  - onEnd: Callback to run when the resource is fetched.
   *  - behaviorElement: The behavior element triggering the behavior. Can be different from
   *    the currentElement.
   */
  onUpdateFragment = (href, action, currentElement, opts) => {
    const options = opts || {};
    const {
      verb, targetId, showIndicatorIds, hideIndicatorIds, delay, once, onEnd, behaviorElement,
    } = options;

    const formData = this.getFormData(currentElement);

    // TODO: Check ran-once on the behavior element, not current element.
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

    // Render the indicator modifications
    if (changedIndicator) {
      this.setState({
        doc: newRoot,
      });
    }

    // Fetch the resource, then perform the action on the target and undo indicators.
    const fetchPromise = () => this.fetchElement(href, verb, newRoot, formData)
      .then((newElement) => {
        // If the action is only supposed to run once, set an attribute indicating
        // that it already ran, so that it won't run again next time the action is triggered.
        // TODO: Store ran-once on the behavior element, not current element.
        if (once) {
          currentElement.setAttribute('ran-once', 'true');
          newRoot = this.shallowCloneToRoot(currentElement.parentNode);
        }

        // If a target is specified and exists, use it. Otherwise, the action target defaults
        // to the element triggering the action.
        let targetElement = targetId ? newRoot.getElementById(targetId) : currentElement;
        if (!targetElement) {
          targetElement = currentElement;
        }

        if (action === 'replace') {
          const parentElement = targetElement.parentNode;
          parentElement.replaceChild(newElement, targetElement);
          newRoot = this.shallowCloneToRoot(parentElement);
        }

        if (action === 'replace-inner') {
          let child = targetElement.firstChild;
          // Remove the target's children
          while (child !== null) {
            const nextChild = child.nextSibling;
            targetElement.removeChild(child);
            child = nextChild;
          }
          targetElement.appendChild(newElement);
          newRoot = this.shallowCloneToRoot(targetElement);
        }

        if (action === 'append') {
          targetElement.appendChild(newElement);
          newRoot = this.shallowCloneToRoot(targetElement);
        }

        if (action === 'prepend') {
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

        // Re-render the modifications
        this.setState({
          doc: newRoot,
        });

        // in dev mode log the updated xml for debugging purposes
        if (__DEV__) {
          console.log('Updated XML:', this.serializer.serializeToString(newRoot.documentElement));
        }

        onEnd && onEnd();
      });

    if (delay) {
      later(parseInt(delay, 10)).then(fetchPromise);
    } else {
      fetchPromise();
    }
  }

  /**
   * Used internally to update the state of things like select forms.
   */
  onSwap = (currentElement, newElement) => {
    const parentElement = currentElement.parentNode;
    parentElement.replaceChild(newElement, currentElement);
    const newRoot = this.shallowCloneToRoot(parentElement);
    this.setState({
      doc: newRoot,
    });
  }

  /**
   * Extensions for custom behaviors. Depends on callback props injected by the parent app.
   */
  onCustomUpdate = (behaviorElement) => {
    const action = behaviorElement.getAttribute('action');
    if (action === 'redux') {
      const reduxAction = behaviorElement.getAttributeNS(REDUX_NS, 'action');
      const extraNode = behaviorElement.getAttributeNodeNS(REDUX_NS, 'extra');
      if (reduxAction && this.props.dispatchReduxAction) {
        const extra = extraNode ? JSON.parse(extraNode.value) : null;
        this.props.dispatchReduxAction({
          type: reduxAction,
          ...extra,
        });
      }
    } else if (action === 'intercom') {
      const intercomAction = behaviorElement.getAttributeNS(INTERCOM_NS, 'action');
      if (intercomAction === 'open' && this.props.openHelpDesk) {
        const topic = behaviorElement.getAttributeNS(INTERCOM_NS, 'topic');
        this.props.openHelpDesk(topic);
      }
    } else if (action === 'amplitude') {
      const name = behaviorElement.getAttributeNS(AMPLITUDE_NS, 'event');
      if (name && this.props.logEvent) {
        const propNode = behaviorElement.getAttributeNodeNS(AMPLITUDE_NS, 'event-props');
        const properties = propNode ? JSON.parse(propNode.value) : undefined;
        this.props.logEvent({ name, properties });
      }
    } else if (action === 'phone') {
      const number = behaviorElement.getAttributeNS(PHONE_NS, 'number');
      if (number && this.props.onCall) {
        this.props.onCall(number);
      }
    } else if (action === 'sms') {
      const number = behaviorElement.getAttributeNS(SMS_NS, 'number');
      if (number && this.props.onSms) {
        this.props.onSms(number);
      }
    } else if (action === 'ask-rating') {
      if (this.props.onAskRating) {
        this.props.onAskRating();
      }
    } else if (action === 'share') {
      // This share API is based off https://facebook.github.io/react-native/docs/0.52/share
      const dialogTitle = behaviorElement.getAttributeNS(SHARE_NS, 'dialog-title');
      const message = behaviorElement.getAttributeNS(SHARE_NS, 'message');
      const subject = behaviorElement.getAttributeNS(SHARE_NS, 'subject');
      const title = behaviorElement.getAttributeNS(SHARE_NS, 'title');
      const url = behaviorElement.getAttributeNS(SHARE_NS, 'url');

      if ((message || url) && this.props.onShare) {
        this.props.onShare({ dialogTitle, message, subject, title, url });
      }
    } else if (action === 'alert') {
      // Shows an alert with options that can trigger other behaviors.

      const title = behaviorElement.getAttributeNS(HYPERVIEW_ALERT_NS, 'title');
      const message = behaviorElement.getAttributeNS(HYPERVIEW_ALERT_NS, 'message');

      // Get the immediate alert:option nodes. We don't use getElementsByTagname to
      // avoid getting options for nested alerts.
      const optionElements = Array.from(behaviorElement.childNodes).filter(
        n => n.namespaceURI === HYPERVIEW_ALERT_NS && n.localName === 'option'
      )

      // Create the options for the alert.
      // NOTE: Android supports at most 3 options.
      const options = optionElements.map(optionElement => ({
        text: optionElement.getAttributeNS(HYPERVIEW_ALERT_NS, 'label'),
        onPress: () => {
          getBehaviorElements(optionElement).filter(
            // Only behaviors with "press" trigger will get executed.
            // "press" is also the default trigger, so if no trigger is specified,
            // the behavior will also execute.
            e => !e.getAttribute('trigger') || e.getAttribute('trigger') === 'press'
          ).forEach((behaviorElement, i) => {
            const href = behaviorElement.getAttribute('href');
            const action = behaviorElement.getAttribute('action');
            const verb = behaviorElement.getAttribute('verb');
            const targetId = behaviorElement.getAttribute('target');
            const showIndicatorIds = behaviorElement.getAttribute('show-during-load');
            const hideIndicatorIds = behaviorElement.getAttribute('hide-during-load');
            const delay = behaviorElement.getAttribute('delay');
            const once = behaviorElement.getAttribute('once');

            // With multiple behaviors for the same trigger, we need to stagger
            // the updates a bit so that each update operates on the latest DOM.
            // Ideally, we could apply multiple DOM updates at a time.
            later(i).then(() => this.onUpdate(href, action, optionElement, {
                verb,
                targetId,
                showIndicatorIds,
                hideIndicatorIds,
                delay,
                once,
                behaviorElement,
              })
            )
          });
        }
      }));

      // Show alert
      Alert.alert(title, message, options);
    } else {
      // No behavior detected.
      console.warn(`No behavior registered for action "${action}"`);
    }
  }

  /**
   * Clones the element and moves all children from the original element
   * to the clone. The returned element will be a new object, but all of the child
   * nodes will be existing objects.
   */
  shallowClone = (element) => {
    const newElement = element.cloneNode(false);
    let childNode = element.firstChild;
    while (childNode !== null) {
      const nextChild = childNode.nextSibling;
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
  shallowCloneToRoot = (element) => {
    const elementClone = this.shallowClone(element);
    if (element.nodeType === 9) {
      return elementClone;
    }
    element.parentNode.replaceChild(elementClone, element);
    const parentClone = this.shallowCloneToRoot(element.parentNode);
    return parentClone;
  }
}

export * from 'hyperview/src/types';
