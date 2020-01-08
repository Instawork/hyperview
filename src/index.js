/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Cache from 'hyperview/src/services/cache';
import * as Components from 'hyperview/src/services/components';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as UrlService from 'hyperview/src/services/url';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Easing,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DOMParser, XMLSerializer } from 'xmldom-instawork';
import HyperRef from 'hyperview/src/core/hyper-ref';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Navigation from 'hyperview/src/services/navigation';
import React from 'react';
import VisibilityDetectingView from './VisibilityDetectingView.js';
import { addHref, createProps, getBehaviorElements, getFirstTag, later, shallowCloneToRoot, getFormData } from 'hyperview/src/services';
import { version } from '../package.json';
import {
  ACTIONS,
  FORM_NAMES,
  NAV_ACTIONS,
  ON_EVENT_DISPATCH,
  ON_RESPONSE_REVALIDATED,
  ON_RESPONSE_STALE_NETWORK_ERROR,
  ON_RESPONSE_STALE_REVALIDATING,
  ON_RESPONSE_STALE_SERVER_ERROR,
  UPDATE_ACTIONS
} from 'hyperview/src/types';
import urlParse from 'url-parse';
import Emitter from 'tiny-emitter';
import globalEventEmitter from 'tiny-emitter/instance';

// Re-export the Cache module so that the embedding app can
// configure the cache.
export {Cache};


const AMPLITUDE_NS = Namespaces.AMPLITUDE;
const HYPERVIEW_ALERT_NS = Namespaces.HYPERVIEW_ALERT;
const HYPERVIEW_NS = Namespaces.HYPERVIEW;
const INTERCOM_NS = Namespaces.INTERCOM;
const PHONE_NS = Namespaces.PHONE;
const REDUX_NS = Namespaces.REDUX;
const SHARE_NS = Namespaces.SHARE;
const SMS_NS = Namespaces.SMS;

const HYPERVIEW_VERSION = version;

function getHyperviewHeaders() {
  const { width, height } = Dimensions.get('window');
  return {
    'X-Hyperview-Version': HYPERVIEW_VERSION,
    'X-Hyperview-Dimensions': `${width}w ${height}h`,
  };
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

// Provides the date format function to use in date fields
// in the screen.
export const DateFormatContext = React.createContext();

/**
 *
 */
export default class HyperScreen extends React.Component {
  static createProps = createProps;
  static renderChildren = Render.renderChildren;

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.reload = this.reload.bind(this);
    this.parseError = this.parseError.bind(this);

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

    this.behaviorRegistry = Behaviors.getRegistry(this.props.behaviors);
    this.componentRegistry = Components.getRegistry(this.props.components);
    this.screenEventEmitter = new Emitter();
    this.navigation = new Navigation(
      this.state.url,
      this.state.doc,
      this.getNavigation(),
    )
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

  getNavigationState = (props) => {
    if (props.navigation) {
      return props.navigation.state;
    }
    return { params: {} };
  }

  componentDidMount() {
    const { params } = this.getNavigationState(this.props);
    // The screen may be rendering via a navigation from another HyperScreen.
    // In this case, the url to load in the screen will be passed via navigation props.
    // Otherwise, use the entrypoint URL provided as a prop to the first HyperScreen.
    const url = params.url || this.props.entrypointUrl || null;

    const preloadScreen = params.preloadScreen
      ? this.navigation.getPreloadScreen(params.preloadScreen)
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
    const oldNavigationState = this.getNavigationState(this.props);
    const newNavigationState = this.getNavigationState(nextProps);

    const newUrl = newNavigationState.params.url;
    const oldUrl = oldNavigationState.params.url;
    const newPreloadScreen = newNavigationState.params.preloadScreen;
    const oldPreloadScreen = oldNavigationState.params.preloadScreen;

    if (newPreloadScreen !== oldPreloadScreen) {
      this.navigation.removePreloadScreen(oldPreloadScreen);
    }

    // TODO: If the preload screen is changing, delete the old one from
    // this.navigation.preloadScreens to prevent memory leaks.

    if (newUrl && newUrl !== oldUrl) {
      this.needsLoad = true;

      const preloadScreen = newPreloadScreen
        ? this.navigation.getPreloadScreen(newPreloadScreen)
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
    const { params } = this.getNavigationState(this.props);
    const { preloadScreen } = params;
    if (preloadScreen && this.navigation.getPreloadScreen(preloadScreen)) {
      this.navigation.remove(preloadScreen);
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

    if (!prevState.warningHeader && this.state.warningHeader) {
      this.screenEventEmitter.emit(ON_RESPONSE_REVALIDATED);
    }
  }

  /**
   * Performs a full load of the screen.
   */
  load = () => {
    const { params, key: routeKey } = this.getNavigationState(this.props);
    const { delay } = params;
    const url = this.state.url;

    const fetchOptions = {
      headers: getHyperviewHeaders(),
      onRevalidate: () => this.screenEventEmitter.emit(ON_RESPONSE_REVALIDATED),
    };
    const fetchPromise = () => this.props.fetch(url, fetchOptions)
      .then(async (response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const warningHeader = response.headers.get('warning');
        const responseText = await response.text();
        return { warningHeader, responseText };
      })
      .then(({ responseText, warningHeader }) => {
        if (typeof this.props.onParseBefore === 'function') {
          this.props.onParseBefore(url);
        }
        let doc = this.parser.parseFromString(responseText);
        let error = false;
        const stylesheets = Stylesheets.createStylesheets(doc);
        this.navigation.setRouteKey(url, routeKey);

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
          warningHeader,
          styles: stylesheets,
          error,
        });
        if (typeof this.props.onParseAfter === 'function') {
          this.props.onParseAfter(url);
        }
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
   * @param opt_href: Optional string href to use when reloading the screen. If not provided,
   * the screen's current URL will be used.
   */
  reload = (opt_href) => {
    const url = (opt_href === undefined || opt_href === '#')
      ? this.state.url
      : UrlService.getUrlFromHref(opt_href, this.state.url);
    this.needsLoad = true;
    this.setState({
      error: false,
      url,
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
          <TouchableOpacity onPress={() => this.reload()}>
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
    const screenElement = Render.renderElement(
      body,
      this.state.styles,
      this.onUpdate,
      {
        screenUrl: url,
        componentRegistry: this.componentRegistry,
        screenEventEmitter: this.screenEventEmitter,
      },
    );

    return (
      <DateFormatContext.Provider value={this.props.formatDate}>
        {screenElement}
      </DateFormatContext.Provider>
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
    if (href[0] === '#') {
      return new Promise((resolve, reject) => {
        const element = root.getElementById(href.slice(1));
        if (element) {
          resolve(element.cloneNode(true));
        }
        reject();
      });
    }

    // For GET requests, we can't include a body so we encode the form data as a query
    // string in the URL.
    const url = verb === 'GET'
      ? UrlService.addFormDataToUrl(UrlService.getUrlFromHref(href, this.state.url), formData)
      : UrlService.getUrlFromHref(href, this.state.url);

    const options = {
      method: verb,
      headers: getHyperviewHeaders(),
      // For non-GET requests, include the formdata as the body of the request.
      body: verb === 'GET' ? undefined : formData,
    };

    return this.props.fetch(url, options)
      .then(response => response.text())
      .then(responseText => {
        if (typeof this.props.onParseBefore === 'function') {
          this.props.onParseBefore(url);
        }
        const parsed = this.parser.parseFromString(responseText).documentElement;
        if (typeof this.props.onParseAfter === 'function') {
          this.props.onParseAfter(url);
        }
        return parsed;
      });
  }



  /**
   *
   */
  onUpdate = (href, action, currentElement, opts) => {
    if (action === ACTIONS.RELOAD) {
      this.reload(href);
    } else if (action === ACTIONS.DEEP_LINK) {
      Linking.openURL(href);
    } else if (Object.values(NAV_ACTIONS).includes(action)) {
      this.navigation.setUrl(this.state.url);
      this.navigation.setDocument(this.state.doc);
      this.navigation.navigate(href || Navigation.ANCHOR_ID_SEPARATOR, action, currentElement, opts);
    } else if (Object.values(UPDATE_ACTIONS).includes(action)) {
      this.onUpdateFragment(href, action, currentElement, opts);
    } else if (action === ACTIONS.SWAP) {
      this.onSwap(currentElement, opts.newElement);
    } else if (action === ACTIONS.DISPATCH_EVENT) {
      const { behaviorElement } = opts;
      const eventName = behaviorElement.getAttribute('event-name');
      const trigger = behaviorElement.getAttribute('trigger');
      const ranOnce = behaviorElement.getAttribute('ran-once');
      const once = behaviorElement.getAttribute('once');
      const delay = behaviorElement.getAttribute('delay');

      if (once === 'true' && ranOnce === 'true') {
        return;
      } else if (once === 'true') {
        behaviorElement.setAttribute('ran-once', 'true');
      }

      // Check for event loop formation
      if (trigger === 'on-event') {
        throw new Error('trigger="on-event" and action="dispatch-event" cannot be used on the same element');
      }
      if (!eventName) {
        throw new Error('dispatch-event requires an event-name attribute to be present');
      }

      const dispatchEvent = () => {
        // Log the dispatched action before emitting to ensure it appears first in logs
        if (__DEV__) {
          const emitterElement: Element = behaviorElement.cloneNode(false);
          console.log(
            `[dispatch-event] action [${eventName}] emitted by:`,
            this.serializer.serializeToString(emitterElement),
          );
        }
        globalEventEmitter.emit(ON_EVENT_DISPATCH, eventName);
      }

      if (delay) {
        setTimeout(dispatchEvent, parseInt(delay, 10));
      } else {
        dispatchEvent();
      }
    } else {
      const { behaviorElement } = opts;
      this.onCustomUpdate(behaviorElement);
    }
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

    const formData = getFormData(currentElement);

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
          newRoot = shallowCloneToRoot(el.parentNode);
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
          newRoot = shallowCloneToRoot(el.parentNode);
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
          newRoot = shallowCloneToRoot(currentElement.parentNode);
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
          newRoot = shallowCloneToRoot(parentElement);
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
          newRoot = shallowCloneToRoot(targetElement);
        }

        if (action === 'append') {
          targetElement.appendChild(newElement);
          newRoot = shallowCloneToRoot(targetElement);
        }

        if (action === 'prepend') {
          targetElement.insertBefore(newElement, targetElement.firstChild);
          newRoot = shallowCloneToRoot(targetElement);
        }

        // Update the DOM to hide the indicators shown during the request.
        if (showIndicatorIds) {
          showIndicatorIds.split(' ').forEach((id) => {
            const el = newRoot.getElementById(id);
            if (el) {
              el.setAttribute('hide', 'true');
              newRoot = shallowCloneToRoot(el.parentNode);
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
              newRoot = shallowCloneToRoot(el.parentNode);
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
    const newRoot = shallowCloneToRoot(parentElement);
    this.setState({
      doc: newRoot,
    });
  }

  /**
   * Extensions for custom behaviors.
   */
  onCustomUpdate = (behaviorElement: Element) => {
    const action = behaviorElement.getAttribute('action');
    const behavior = this.behaviorRegistry[action];
    if (behavior) {
      const updateRoot = (newRoot) => this.setState({ doc: newRoot });
      const getRoot = () => this.state.doc;
      behavior.callback(behaviorElement, this.onUpdate, getRoot, updateRoot);
    } else {
      // No behavior detected.
      console.warn(`No behavior registered for action "${action}"`);
    }
  }
}

export * from 'hyperview/src/types';
