// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Behaviors from 'hyperview/src/behaviors';
import * as Components from 'hyperview/src/services/components';
import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as UrlService from 'hyperview/src/services/url';
import * as Xml from 'hyperview/src/services/xml';
import { ACTIONS, NAV_ACTIONS, UPDATE_ACTIONS } from 'hyperview/src/types';
import type { Action, BehaviorRegistry, ComponentRegistry, Document, Element, HttpVerb, HvComponentOptions, NavigationProps, NavigationState, Props, State, StyleSheets } from 'hyperview/src/types';
// eslint-disable-next-line instawork/import-services
import Navigation, { ANCHOR_ID_SEPARATOR } from 'hyperview/src/services/navigation';
import { createProps, createStyleProp, getElementByTimeoutId, getFormData, later, removeTimeoutId, setTimeoutId, shallowCloneToRoot } from 'hyperview/src/services';
import { Linking } from 'react-native';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
import React from 'react';

// eslint-disable-next-line instawork/pure-components
export default class HyperScreen extends React.Component<Props, State> {
  static createProps = createProps;

  static createStyleProp = createStyleProp;

  static renderChildren = Render.renderChildren;

  static renderElement = Render.renderElement;

  behaviorRegistry: BehaviorRegistry;

  componentRegistry: ComponentRegistry;

  doc: ?Document;

  navigation: Navigation;

  needsLoad: boolean;

  oldSetState: ?() => void;

  parser: Dom.Parser;

  constructor(props: Props) {
    super(props);

    this.parser = new Dom.Parser(
      this.props.fetch,
      this.props.onParseBefore,
      this.props.onParseAfter
    );

    this.needsLoad = false;
    this.state = {
      doc: null,
      error: null,
      styles: null,
      url: props.entrypointUrl,
    };

    // <HACK>
    // In addition to storing the document on the react state, we keep a reference to it
    // on the instance. When performing batched updates on the DOM, we need to ensure every
    // update occurence operates on the latest DOM version. We cannot rely on `state` right after
    // setting it with `setState`, because React does not guarantee the new state to be immediately
    // available (see details here: https://reactjs.org/docs/react-component.html#setstate)
    // Whenever we need to access the document for reasons other than rendering, we should use
    // `this.doc`. When rendering, we should use `this.state.doc`.
    this.doc = null;
    this.oldSetState = this.setState;
    // $FlowFixMe: this.setState is not writeable
    this.setState = (...args) => {
      if (args[0].doc !== undefined) {
        this.doc = args[0].doc;
      }
      // $FlowFixMe: this.oldSetState is defined
      this.oldSetState(...args);
    }
    // </HACK>

    this.behaviorRegistry = Behaviors.getRegistry(this.props.behaviors);
    this.componentRegistry = Components.getRegistry(this.props.components);
    this.navigation = new Navigation(props.entrypointUrl, this.getNavigation());
  }

  getNavigationState = (props: Props): NavigationState => {
    if (props.navigation) {
      return props.navigation.state;
    }
    return { key: '', params: {} };
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
    // $FlowFixMe: we currently have a type mismatch, where state.doc is a Document type, but preload screens are Element types
    const preloadStyles: ?StyleSheets = preloadScreen ? Stylesheets.createStylesheets(preloadScreen) : {};

    this.needsLoad = true;
    if (preloadScreen) {
      // $FlowFixMe: we currently have a type mismatch, where state.doc is a Document type, but preload screens are Element types
      const doc: Document = preloadScreen;
      this.setState({
        doc,
        error: null,
        styles: preloadStyles,
        url,
      });
    } else {
      this.setState({
        error: null,
        url,
      });
    }
  }

  /**
   * Potentially updates state when navigating back to the mounted screen.
   * If the navigation params have a different URL than the screen's URL, Update the
   * preload screen and URL to load.
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
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

      // $FlowFixMe: we currently have a type mismatch, where state.doc is a Document type, but preload screens are Element types
      const doc: Document = preloadScreen || this.doc;

      // $FlowFixMe: we currently have a type mismatch, where state.doc is a Document type, but preload screens are Element types
      const styles = preloadScreen ? Stylesheets.createStylesheets(preloadScreen) : this.state.styles; // eslint-disable-line react/no-access-state-in-setstate

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
      this.navigation.removePreloadScreen(preloadScreen);
    }
  }

  /**
   * Fetch data from the url if the screen should reload.
   */
  componentDidUpdate() {
    if (this.needsLoad) {
      this.load();
      this.needsLoad = false;
    }
  }

  /**
   * Performs a full load of the screen.
   */
  load = async () => {
    const { params, key: routeKey } = this.getNavigationState(this.props);

    try {
      if (params.delay) {
        await later(parseInt(params.delay, 10));
      }

      // eslint-disable-next-line react/no-access-state-in-setstate
      const doc = await this.parser.loadDocument(this.state.url);
      const stylesheets = Stylesheets.createStylesheets(doc);
      this.navigation.setRouteKey(this.state.url, routeKey);
      this.setState({
        doc,
        error: null,
        styles: stylesheets,
      });

    } catch (err) {
      this.setState({
        doc: null,
        error: err,
        styles: null,
      });
    }
  }

  /**
   * Reload if an error occured.
   * @param opt_href: Optional string href to use when reloading the screen. If not provided,
   * the screen's current URL will be used.
   */
  reload = (optHref: ?string) => {
    if (!optHref) {
      return;
    }
    const url = optHref === '#'
      ? this.state.url // eslint-disable-line react/no-access-state-in-setstate
      : UrlService.getUrlFromHref(optHref, this.state.url); // eslint-disable-line react/no-access-state-in-setstate
    this.needsLoad = true;
    this.setState({
      error: null,
      url,
    });
  }

  /**
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  render() {
    if (this.state.error) {
      return (
        <LoadError
          error={this.state.error}
          onPressReload={() => this.reload()}
          onPressViewDetails={(uri) => this.props.openModal({ delay: null, preloadScreen: null, url: uri})}
        />
      );
    }
    if (!this.state.doc) {
      return (
        <Loading />
      );
    }
    const body = this.state.doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body').item(0);
    const screenElement = body
      ? Render.renderElement(
          body,
          this.state.styles,
          this.onUpdate,
          {
            componentRegistry: this.componentRegistry,
            screenUrl: this.state.url,
          },
      ): null;

    return (
      <Contexts.DateFormatContext.Provider value={this.props.formatDate}>
        {screenElement}
      </Contexts.DateFormatContext.Provider>
    );
  }

  /**
   * Returns a navigation object similar to the one provided by React Navigation,
   * but connected to props injected by the parent app.
   */
  getNavigation = (): NavigationProps => ({
    back: this.props.back,
    closeModal: this.props.closeModal,
    navigate: this.props.navigate,
    openModal: this.props.openModal,
    push: this.props.push,
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
  fetchElement = async (href: ?string, method: ?HttpVerb, root: ?Document, formData: ?FormData): Promise<Element> => {
    if (!href || !root) {
      // TODO: make href and root non-optional, and refactor callers to ensure they exist.
      throw new Error('Cannot fetch an element without an href');
    }
    if (href[0] === '#') {
      const element = root.getElementById(href.slice(1));
      if (element) {
        return element.cloneNode(true);
      }
      throw new Error();
    }

    try {
      const url = UrlService.getUrlFromHref(href, this.state.url);
      const doc = await this.parser.loadElement(url, formData, method);
      return doc.documentElement;
    } catch (err) {
      this.setState({
        doc: null,
        error: err,
        styles: null,
      });
      // Rethrow error after updating state
      throw err;
    }
  }

  /**
   *
   */
  onUpdate = (href: ?string, action: Action, currentElement: Element, opts: HvComponentOptions) => {
    if (action === ACTIONS.RELOAD) {
      this.reload(href);
    } else if (action === ACTIONS.DEEP_LINK) {
      if (href) {
        Linking.openURL(href);
      }
    } else if (Object.values(NAV_ACTIONS).includes(action)) {
      this.navigation.setUrl(this.state.url);
      this.navigation.setDocument(this.doc);
      this.navigation.navigate(href || ANCHOR_ID_SEPARATOR, action, currentElement, opts);
    } else if (Object.values(UPDATE_ACTIONS).includes(action)) {
      this.onUpdateFragment(href, action, currentElement, opts);
    } else if (action === ACTIONS.SWAP) {
      if (opts.newElement) {
        this.onSwap(currentElement, opts.newElement);
      }
    } else if (action === ACTIONS.DISPATCH_EVENT) {
      if (opts.behaviorElement) {
        const { behaviorElement } = opts;
        const eventName = behaviorElement.getAttribute('event-name');
        const trigger = behaviorElement.getAttribute('trigger');
        const ranOnce = behaviorElement.getAttribute('ran-once');
        const once = behaviorElement.getAttribute('once');
        const delay = behaviorElement.getAttribute('delay');

        if (once === 'true' && ranOnce === 'true') {
          return;
        } if (once === 'true') {
          behaviorElement.setAttribute('ran-once', 'true');
        }

        // Check for event loop formation
        if (trigger === 'on-event') {
          throw new Error('trigger="on-event" and action="dispatch-event" cannot be used on the same element');
        }
        if (!eventName) {
          throw new Error('dispatch-event requires an event-name attribute to be present');
        }

        const dispatch = () => {
          Events.dispatch(eventName);
        }

        if (delay) {
          setTimeout(dispatch, parseInt(delay, 10));
        } else {
          dispatch();
        }
      }
    } else if (opts.behaviorElement) {
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
  onUpdateFragment = (href: ?string, action: Action, currentElement: Element, opts: HvComponentOptions) => {
    const options = opts || {};
    const {
      verb, targetId, showIndicatorIds, hideIndicatorIds, delay, once, onEnd,
    } = options;

    const showIndicatorIdList = showIndicatorIds ? Xml.splitAttributeList(showIndicatorIds) : [];
    const hideIndicatorIdList = hideIndicatorIds ? Xml.splitAttributeList(hideIndicatorIds) : [];

    const formData = getFormData(currentElement);

    // TODO: Check ran-once on the behavior element, not current element.
    if (once) {
      if (currentElement.getAttribute('ran-once')) {
        // This action is only supposed to run once, and it already ran,
        // so there's nothing more to do.
        if (typeof onEnd === 'function') {
          onEnd();
        }
        return;
      }
        currentElement.setAttribute('ran-once', 'true');

    }

    let newRoot = this.doc;
    if (newRoot) {
      newRoot = Behaviors.setIndicatorsBeforeLoad(showIndicatorIdList, hideIndicatorIdList, newRoot);
    }
    // Re-render the modifications
    this.setState({
      doc: newRoot,
    });

    // Fetch the resource, then perform the action on the target and undo indicators.
    const fetchAndUpdate = () => this.fetchElement(href, verb, newRoot, formData)
      .then((newElement) => {
        // If a target is specified and exists, use it. Otherwise, the action target defaults
        // to the element triggering the action.
        let targetElement = targetId && this.doc ? this.doc.getElementById(targetId) : currentElement;
        if (!targetElement) {
          targetElement = currentElement;
        }

        newRoot = Behaviors.performUpdate(action, targetElement, newElement);
        newRoot = Behaviors.setIndicatorsAfterLoad(showIndicatorIdList, hideIndicatorIdList, newRoot);
        // Re-render the modifications
        this.setState({
          doc: newRoot,
        });

        if (typeof onEnd === 'function') {
          onEnd();
        }
      });

    if (delay) {
      /**
       * Delayed behaviors will only trigger after a given amount of time.
       * During that time, the DOM may change and the triggering element may no longer
       * be in the document. When that happens, we don't want to trigger the behavior after the time
       * elapses. To track this, we store the timeout id (generated by setTimeout) on the triggering
       * element, and then look it up in the document after the elapsed time. If the timeout id is not
       * present, we update the indicators but don't execute the behavior.
       */
      const delayMs = parseInt(delay, 10);
      let timeoutId = null;
      timeoutId = setTimeout(() => {
        // Check the current doc for an element with the same timeout ID
        const timeoutElement = this.doc ? getElementByTimeoutId(this.doc, String(timeoutId)) : null;
        if (timeoutElement) {
          // Element with the same ID exists, we can execute the behavior
          removeTimeoutId(timeoutElement);
          fetchAndUpdate();
        } else {
          // Element with the same ID does not exist, we don't execute the behavior and undo the indicators.
          if (this.doc) {
            newRoot = Behaviors.setIndicatorsAfterLoad(showIndicatorIdList, hideIndicatorIdList, this.doc);
            this.setState({
              doc: newRoot,
            });
          }
          if (typeof onEnd === 'function') {
            onEnd();
          }
        }
      }, delayMs);
      // Store the timeout ID
      setTimeoutId(currentElement, String(timeoutId));
    } else {
      // If there's no delay, fetch immediately and update the doc when done.
      fetchAndUpdate();
    }
  }

  /**
   * Used internally to update the state of things like select forms.
   */
  onSwap = (currentElement: Element, newElement: Element) => {
    const parentElement: ?Element = currentElement.parentNode;
    if (parentElement) {
      parentElement.replaceChild(newElement, currentElement);
      const newRoot = shallowCloneToRoot(parentElement);
      this.setState({
        doc: newRoot,
      });
    }
  }

  /**
   * Extensions for custom behaviors.
   */
  onCustomUpdate = (behaviorElement: Element) => {
    // $FlowFixMe: Somehow, even with explicit typing, flow sees `behaviorElement` as a `Node`
    const action = behaviorElement.getAttribute('action');
    const behavior = this.behaviorRegistry[action];
    if (behavior) {
      const updateRoot = (newRoot) => this.setState({ doc: newRoot });
      const getRoot = () => this.doc;
      behavior.callback(behaviorElement, this.onUpdate, getRoot, updateRoot);
    } else {
      // No behavior detected.
      console.warn(`No behavior registered for action "${action}"`);
    }
  }
}

export * from 'hyperview/src/types';
export { Events, Namespaces };
