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
import * as HvScreenProps from 'hyperview/src/core/components/hv-screen/types';
import * as NavContexts from 'hyperview/src/contexts/navigation';
import * as Navigation from 'hyperview/src/services/navigation';
import * as Render from 'hyperview/src/services/render';
import * as Services from 'hyperview/src/services';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as UrlService from 'hyperview/src/services/url';
import * as Xml from 'hyperview/src/services/xml';
import {
  ACTIONS,
  BehaviorRegistry,
  ComponentRegistry,
  DOMString,
  HvComponentOptions,
  NAV_ACTIONS,
  NavAction,
  OnUpdateCallbacks,
  UPDATE_ACTIONS,
  UpdateAction,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import HvRoute from 'hyperview/src/core/components/hv-route';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import { Linking } from 'react-native';

/**
 * Provides routing to the correct path based on the state passed in
 */
export default class Hyperview extends PureComponent<HvScreenProps.Props> {
  static createProps = Services.createProps;

  static createStyleProp = Services.createStyleProp;

  static renderChildren = Render.renderChildren;

  static renderElement = Render.renderElement;

  behaviorRegistry: BehaviorRegistry;

  componentRegistry: ComponentRegistry;

  formComponentRegistry: ComponentRegistry;

  parser: Dom.Parser;

  constructor(props: HvScreenProps.Props) {
    super(props);

    this.parser = new Dom.Parser(
      this.props.fetch,
      this.props.onParseBefore,
      this.props.onParseAfter,
    );

    this.behaviorRegistry = Behaviors.getRegistry(this.props.behaviors);
    this.componentRegistry = Components.getRegistry(this.props.components);
    this.formComponentRegistry = Components.getFormRegistry(
      this.props.components,
    );
  }

  /**
   * Reload if an error occured.
   * @param opt_href: Optional string href to use when reloading the screen. If not provided,
   * the screen's current URL will be used.
   */
  reload = (
    optHref: DOMString | null | undefined,
    opts: HvComponentOptions,
    callbacks: OnUpdateCallbacks,
  ) => {
    const isBlankHref =
      optHref === null ||
      optHref === undefined ||
      optHref === '#' ||
      optHref === '';
    const url = isBlankHref
      ? callbacks.getStateUrl()
      : UrlService.getUrlFromHref(optHref, callbacks.getStateUrl());

    if (!url) {
      return;
    }

    const options = opts || {};
    const {
      behaviorElement,
      showIndicatorIds,
      hideIndicatorIds,
      once,
      onEnd,
    } = options;

    const showIndicatorIdList = showIndicatorIds
      ? Xml.splitAttributeList(showIndicatorIds)
      : [];
    const hideIndicatorIdList = hideIndicatorIds
      ? Xml.splitAttributeList(hideIndicatorIds)
      : [];

    if (once && behaviorElement) {
      if (behaviorElement.getAttribute('ran-once')) {
        // This action is only supposed to run once, and it already ran,
        // so there's nothing more to do.
        if (typeof onEnd === 'function') {
          onEnd();
        }
        return;
      }
      Behaviors.setRanOnce(behaviorElement);
    }

    let newRoot = callbacks.getDoc();
    if (showIndicatorIdList || hideIndicatorIdList) {
      newRoot = Behaviors.setIndicatorsBeforeLoad(
        showIndicatorIdList,
        hideIndicatorIdList,
        newRoot,
      );
    }

    // Re-render the modifications
    callbacks.setNeedsLoad();
    callbacks.setState({
      doc: newRoot,
      elementError: null,
      error: null,
      url,
    });
  };

  /**
   * Fetches the provided reference.
   * - If the references is an id reference (starting with #),
   *   returns a clone of that element.
   * - If the reference is a full URL, fetches the URL.
   * - If the reference is a path, fetches the path from the host of the URL
   *   used to render the screen.
   * Returns a promise that resolves to a DOM element.
   */
  fetchElement = async (
    href: DOMString | null | undefined,
    method: DOMString | null | undefined = Dom.HTTP_METHODS.GET,
    root: Document,
    formData: FormData | null | undefined,
    callbacks: OnUpdateCallbacks,
  ): Promise<Element | null> => {
    if (!href) {
      throw new Error('No href passed to fetchElement');
    }

    if (href[0] === '#') {
      const element = root.getElementById(href.slice(1));
      if (element) {
        return element.cloneNode(true) as Element;
      }
      throw new Error(`Element with id ${href} not found in document`);
    }

    try {
      const url = UrlService.getUrlFromHref(href, callbacks.getStateUrl());
      const httpMethod: Dom.HttpMethod = method as Dom.HttpMethod;
      const { doc, staleHeaderType } = await this.parser.loadElement(
        url,
        formData || null,
        httpMethod,
      );
      if (staleHeaderType) {
        // We are doing this to ensure that we keep the screen stale until a `reload` happens
        callbacks.setState({ staleHeaderType });
      }
      callbacks.clearElementError();
      return doc.documentElement;
    } catch (err: Error | unknown) {
      if (this.props.onError) {
        this.props.onError(err as Error);
      }
      callbacks.setState({ elementError: err as Error });
    }
    return null;
  };

  onUpdate = (
    href: DOMString | null | undefined,
    action: DOMString | null | undefined,
    element: Element,
    options: HvComponentOptions,
    callbacks: OnUpdateCallbacks,
  ) => {
    const navAction: NavAction = action as NavAction;
    const updateAction: UpdateAction = action as UpdateAction;

    if (action === ACTIONS.RELOAD) {
      this.reload(href, options, callbacks);
    } else if (action === ACTIONS.DEEP_LINK && href) {
      Linking.openURL(href);
    } else if (navAction && Object.values(NAV_ACTIONS).includes(navAction)) {
      const navigation = callbacks.getNavigation();
      if (navigation) {
        const { behaviorElement, delay, newElement, targetId } = options;
        const delayVal: number = +(delay || '');
        navigation.setUrl(callbacks.getStateUrl());
        navigation.setDocument(callbacks.getDoc());
        navigation.navigate(
          href || Navigation.ANCHOR_ID_SEPARATOR,
          navAction,
          element,
          this.formComponentRegistry,
          {
            behaviorElement: behaviorElement || undefined,
            delay: delayVal,
            newElement: newElement || undefined,
            targetId: targetId || undefined,
          },
          callbacks.registerPreload,
        );
      }
    } else if (
      updateAction &&
      Object.values(UPDATE_ACTIONS).includes(updateAction)
    ) {
      this.onUpdateFragment(href, updateAction, element, options, callbacks);
    } else if (action === ACTIONS.SWAP) {
      this.onSwap(element, options.newElement, callbacks);
    } else if (action === ACTIONS.DISPATCH_EVENT) {
      const { behaviorElement } = options;
      if (!behaviorElement) {
        console.warn('dispatch-event requires a behaviorElement');
        return;
      }
      const eventName = behaviorElement.getAttribute('event-name');
      const trigger = behaviorElement.getAttribute('trigger');
      const delay = behaviorElement.getAttribute('delay');

      if (Behaviors.isOncePreviouslyApplied(behaviorElement)) {
        return;
      }

      Behaviors.setRanOnce(behaviorElement);

      // Check for event loop formation
      if (trigger === 'on-event') {
        throw new Error(
          'trigger="on-event" and action="dispatch-event" cannot be used on the same element',
        );
      }
      if (!eventName) {
        throw new Error(
          'dispatch-event requires an event-name attribute to be present',
        );
      }

      const dispatch = () => {
        Events.dispatch(eventName);
      };

      if (delay) {
        setTimeout(dispatch, parseInt(delay, 10));
      } else {
        dispatch();
      }
    } else {
      const { behaviorElement } = options;
      this.onCustomUpdate(behaviorElement, callbacks);
    }
  };

  /**
   * Handler for behaviors on the screen.
   * @param href {string} A reference to the XML to fetch. Can be local (via id reference prepended
   *        by #) or a
   * remote resource.
   * @param action {string} The name of the action to perform with the returned XML.
   * @param element {Element} The XML DOM element triggering the behavior.
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
  onUpdateFragment = (
    href: DOMString | null | undefined,
    action: UpdateAction,
    element: Element,
    options: HvComponentOptions,
    callbacks: OnUpdateCallbacks,
  ) => {
    const opts = options || {};
    const {
      behaviorElement,
      verb,
      targetId,
      showIndicatorIds,
      hideIndicatorIds,
      delay,
      once,
      onEnd,
    } = opts;

    const showIndicatorIdList = showIndicatorIds
      ? Xml.splitAttributeList(showIndicatorIds)
      : [];
    const hideIndicatorIdList = hideIndicatorIds
      ? Xml.splitAttributeList(hideIndicatorIds)
      : [];

    const formData = Services.getFormData(element, this.formComponentRegistry);

    if (once && behaviorElement) {
      if (behaviorElement.getAttribute('ran-once')) {
        // This action is only supposed to run once, and it already ran,
        // so there's nothing more to do.
        if (typeof onEnd === 'function') {
          onEnd();
        }
        return;
      }
      Behaviors.setRanOnce(behaviorElement);
    }

    let newRoot: Document = callbacks.getDoc();
    newRoot = Behaviors.setIndicatorsBeforeLoad(
      showIndicatorIdList,
      hideIndicatorIdList,
      newRoot,
    );
    // Re-render the modifications
    callbacks.setState({
      doc: newRoot,
    });

    // Fetch the resource, then perform the action on the target and undo indicators.
    const fetchAndUpdate = () =>
      this.fetchElement(href, verb, newRoot, formData, callbacks).then(
        newElement => {
          // If a target is specified and exists, use it. Otherwise, the action target defaults
          // to the element triggering the action.
          let targetElement = targetId
            ? callbacks.getDoc()?.getElementById(targetId)
            : element;
          if (!targetElement) {
            targetElement = element;
          }

          if (newElement) {
            newRoot = Behaviors.performUpdate(
              action,
              targetElement,
              newElement as Element,
            );
          } else {
            // When fetch fails, make sure to get the latest version of
            // the doc to avoid any race conditions
            newRoot = callbacks.getDoc();
          }
          newRoot = Behaviors.setIndicatorsAfterLoad(
            showIndicatorIdList,
            hideIndicatorIdList,
            newRoot,
          );
          // Re-render the modifications
          callbacks.setState({
            doc: newRoot,
          });

          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
      );

    if (delay) {
      /**
       * Delayed behaviors will only trigger after a given amount of time.
       * During that time, the DOM may change and the triggering element may no longer
       * be in the document. When that happens, we don't want to trigger the behavior after the time
       * elapses. To track this, we store the timeout id (generated by setTimeout) on the triggering
       * element, and then look it up in the document after the elapsed time.
       * If the timeout id is not present, we update the indicators but don't execute the behavior.
       */
      const delayMs = parseInt(delay, 10);
      const timeoutId = setTimeout(() => {
        // Check the current doc for an element with the same timeout ID
        const timeoutElement = Services.getElementByTimeoutId(
          callbacks.getDoc(),
          timeoutId.toString(),
        );
        if (timeoutElement) {
          // Element with the same ID exists, we can execute the behavior
          Services.removeTimeoutId(timeoutElement);
          fetchAndUpdate();
        } else {
          // Element with the same ID does not exist,
          // we don't execute the behavior and undo the indicators.
          newRoot = Behaviors.setIndicatorsAfterLoad(
            showIndicatorIdList,
            hideIndicatorIdList,
            callbacks.getDoc(),
          );
          callbacks.setState({
            doc: newRoot,
          });
          if (typeof onEnd === 'function') {
            onEnd();
          }
        }
      }, delayMs);
      // Store the timeout ID
      Services.setTimeoutId(element, timeoutId.toString());
    } else {
      // If there's no delay, fetch immediately and update the doc when done.
      fetchAndUpdate();
    }
  };

  /**
   * Used internally to update the state of things like select forms.
   */
  onSwap = (
    currentElement: Element,
    newElement: Element | null | undefined,
    callbacks: OnUpdateCallbacks,
  ) => {
    const parentElement = currentElement.parentNode as Element;
    if (!parentElement || !newElement) {
      return;
    }
    parentElement.replaceChild(newElement, currentElement);
    const newRoot = Services.shallowCloneToRoot(parentElement);
    callbacks.setState({
      doc: newRoot,
    });
  };

  /**
   * Extensions for custom behaviors.
   */
  onCustomUpdate = (
    behaviorElement: Element | null | undefined,
    callbacks: OnUpdateCallbacks,
  ) => {
    if (!behaviorElement) {
      console.warn('Custom behavior requires a behaviorElement');
      return;
    }
    const action = behaviorElement.getAttribute('action');
    if (!action) {
      console.warn('Custom behavior requires an action attribute');
      return;
    }
    const behavior = this.behaviorRegistry[action];

    if (Behaviors.isOncePreviouslyApplied(behaviorElement)) {
      return;
    }

    Behaviors.setRanOnce(behaviorElement);

    if (behavior) {
      const updateRoot = (newRoot: Document, updateStylesheet = false) => {
        return updateStylesheet
          ? callbacks.setState({
              doc: newRoot,
              styles: Stylesheets.createStylesheets(newRoot),
            })
          : callbacks.setState({ doc: newRoot });
      };
      const getRoot = () => callbacks.getDoc();
      behavior.callback(
        behaviorElement,
        callbacks.getOnUpdate(),
        getRoot,
        updateRoot,
      );
    } else {
      // No behavior detected.
      console.warn(`No behavior registered for action "${action}"`);
    }
  };

  render() {
    if (this.props.navigation) {
      // Externally provided navigation will use the provided navigation and action callbacks
      return (
        <Contexts.RefreshControlComponentContext.Provider
          value={this.props.refreshControl}
        >
          <HvScreen
            back={this.props.back}
            behaviors={this.props.behaviors}
            closeModal={this.props.closeModal}
            components={this.props.components}
            elementErrorComponent={this.props.elementErrorComponent}
            entrypointUrl={this.props.entrypointUrl}
            errorScreen={this.props.errorScreen}
            fetch={this.props.fetch}
            formatDate={this.props.formatDate}
            loadingScreen={this.props.loadingScreen}
            navigate={this.props.navigate}
            navigation={this.props.navigation}
            onError={this.props.onError}
            onParseAfter={this.props.onParseAfter}
            onParseBefore={this.props.onParseBefore}
            onUpdate={this.onUpdate}
            openModal={this.props.openModal}
            push={this.props.push}
            refreshControl={this.props.refreshControl}
            route={this.props.route}
          />
        </Contexts.RefreshControlComponentContext.Provider>
      );
    }

    // Without an external navigation, all navigation is handled internally
    return (
      <Contexts.DateFormatContext.Provider value={this.props.formatDate}>
        <Contexts.RefreshControlComponentContext.Provider
          value={this.props.refreshControl}
        >
          <NavContexts.Context.Provider
            value={{
              behaviors: this.props.behaviors,
              components: this.props.components,
              elementErrorComponent: this.props.elementErrorComponent,
              entrypointUrl: this.props.entrypointUrl,
              errorScreen: this.props.errorScreen,
              fetch: this.props.fetch,
              handleBack: this.props.handleBack,
              loadingScreen: this.props.loadingScreen,
              onError: this.props.onError,
              onParseAfter: this.props.onParseAfter,
              onParseBefore: this.props.onParseBefore,
              onUpdate: this.onUpdate,
            }}
          >
            <HvRoute />
          </NavContexts.Context.Provider>
        </Contexts.RefreshControlComponentContext.Provider>
      </Contexts.DateFormatContext.Provider>
    );
  }
}
