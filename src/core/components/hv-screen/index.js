/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint instawork/flow-annotate: 0 */
import * as Behaviors from 'hyperview/src/behaviors';
import * as Components from 'hyperview/src/services/components';
import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import { createProps, createStyleProp, later } from 'hyperview/src/services';
import LoadElementError from '../load-element-error';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
// eslint-disable-next-line instawork/import-services
import Navigation from 'hyperview/src/services/navigation';
import React from 'react';

// eslint-disable-next-line instawork/pure-components
export default class HvScreen extends React.Component {
  // eslint-disable-next-line react/static-property-placement
  static contextType = Contexts.DocContext;

  static createProps = createProps;

  static createStyleProp = createStyleProp;

  static renderChildren = Render.renderChildren;

  static renderElement = Render.renderElement;

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);

    this.updateActions = ['replace', 'replace-inner', 'append', 'prepend'];
    this.parser = new Dom.Parser(
      this.props.fetch,
      this.props.onParseBefore,
      this.props.onParseAfter,
    );

    this.needsLoad = false;

    this.behaviorRegistry = Behaviors.getRegistry(this.props.behaviors);
    this.componentRegistry = Components.getRegistry(this.props.components);
    this.formComponentRegistry = Components.getFormRegistry(
      this.props.components,
    );
    this.navigation = new Navigation(props.entrypointUrl, this.getNavigation());
  }

  getRoute = props => {
    // The prop route is available in React Navigation v5 and above
    if (props.route) {
      return props.route;
    }

    // Fallback for older versions of React Navigation
    if (props.navigation) {
      return props.navigation.state;
    }
    return { params: {} };
  };

  componentDidMount() {
    const { params, key } = this.getRoute(this.props);
    // The screen may be rendering via a navigation from another HyperScreen.
    // In this case, the url to load in the screen will be passed via navigation props.
    // Otherwise, use the entrypoint URL provided as a prop to the first HyperScreen.
    const url = params.url || this.props.entrypointUrl || null;

    if (this.context.getState().doc) {
      const stylesheets = Stylesheets.createStylesheets(
        this.context.getState().doc,
      );
      this.needsLoad = false;
      this.navigation.setRouteKey(this.context.getState().url, key);
      this.context.setState({
        styles: stylesheets,
      });
    } else {
      const preloadScreen = params.preloadScreen
        ? this.navigation.getPreloadScreen(params.preloadScreen)
        : null;
      const preloadStyles = preloadScreen
        ? Stylesheets.createStylesheets(preloadScreen)
        : {};

      this.needsLoad = true;
      if (preloadScreen) {
        this.context.setState({
          doc: preloadScreen,
          elementError: null,
          error: null,
          styles: preloadStyles,
          url,
        });
      } else {
        this.context.setState({
          elementError: null,
          error: null,
          url,
        });
      }
    }
  }

  /**
   * Potentially updates state when navigating back to the mounted screen.
   * If the navigation params have a different URL than the screen's URL, Update the
   * preload screen and URL to load.
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = nextProps => {
    const oldNavigationState = this.getRoute(this.props);
    const newNavigationState = this.getRoute(nextProps);

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

      const doc = preloadScreen || this.context.getState().doc;
      const styles = preloadScreen
        ? Stylesheets.createStylesheets(preloadScreen)
        : this.context.getState().styles;

      this.context.setState({ doc, styles, url: newUrl });
    }
  };

  /**
   * Clear out the preload screen associated with this screen.
   */
  componentWillUnmount() {
    const { params } = this.getRoute(this.props);
    const { preloadScreen } = params;
    if (preloadScreen && this.navigation.getPreloadScreen(preloadScreen)) {
      this.navigation.removePreloadScreen(preloadScreen);
    }
    if (this.context.getState().url) {
      this.navigation.removeRouteKey(this.context.getState().url);
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
    const { params, key: routeKey } = this.getRoute(this.props);

    try {
      if (params.delay) {
        await later(parseInt(params.delay, 10));
      }

      const { doc, staleHeaderType } = await this.parser.loadDocument(
        this.context.getState().url,
      );
      const stylesheets = Stylesheets.createStylesheets(doc);
      this.navigation.setRouteKey(this.context.getState().url, routeKey);
      this.context.setState({
        doc,
        elementError: null,
        error: null,
        staleHeaderType,
        styles: stylesheets,
      });
    } catch (err) {
      if (this.props.onError) {
        this.props.onError(err);
      }
      this.context.setState({
        doc: null,
        elementError: null,
        error: err,
        styles: null,
      });
    }
  };

  /**
   * Reload if an error occured using the screen's current URL
   */
  reload = () => {
    this.props.reload(this.context.getState().url, {
      onUpdateCallbacks: this.updateCallbacks,
    });
  };

  /**
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  render() {
    if (this.context.getState().error) {
      const errorScreen = this.props.errorScreen || LoadError;
      return React.createElement(errorScreen, {
        back: () => this.getNavigation().back(),
        error: this.context.getState().error,
        onPressReload: () => this.reload(), // Make sure reload() is called without any args
        onPressViewDetails: uri => this.props.openModal({ url: uri }),
      });
    }
    if (!this.context.getState().styles) {
      const loadingScreen = this.props.loadingScreen || Loading;
      return React.createElement(loadingScreen);
    }
    const elementErrorComponent = this.context.getState().elementError
      ? this.props.elementErrorComponent || LoadElementError
      : null;
    const [body] = Array.from(
      this.context
        .getState()
        .doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body'),
    );
    const screenElement = Render.renderElement(
      body,
      this.context.getState().styles,
      this.onUpdate,
      {
        componentRegistry: this.componentRegistry,
        screenUrl: this.context.getState().url,
        staleHeaderType: this.context.getState().staleHeaderType,
      },
    );

    return (
      <Contexts.DateFormatContext.Provider value={this.props.formatDate}>
        {screenElement}
        {elementErrorComponent
          ? React.createElement(elementErrorComponent, {
              error: this.context.getState().elementError,
              onPressReload: () => this.reload(),
            })
          : null}
      </Contexts.DateFormatContext.Provider>
    );
  }

  /**
   * Returns a navigation object similar to the one provided by React Navigation,
   * but connected to props injected by the parent app.
   */
  getNavigation = () => ({
    back: this.props.back,
    closeModal: this.props.closeModal,
    navigate: this.props.navigate,
    openModal: this.props.openModal,
    push: this.props.push,
  });

  registerPreload = (id, element) => {
    if (this.props.registerPreload) {
      this.props.registerPreload(id, element);
    }
  };

  /**
   * Implement the callbacks from this class
   */
  updateCallbacks = {
    clearElementError: () => {
      if (this.context.getState().elementError) {
        this.context.setState({ elementError: null });
      }
    },
    getDoc: () => this.context.getState().doc,
    getNavigation: () => this.navigation,
    getOnUpdate: () => this.onUpdate,
    getState: () => this.context.getState(),
    registerPreload: (id, element) => this.registerPreload(id, element),
    reload: this.load,
    setNeedsLoad: () => {
      this.needsLoad = true;
    },
    setState: (state, callback) => {
      this.context.setState(state, callback);
    },
  };

  /**
   *
   */
  onUpdate = (href, action, currentElement, opts) => {
    this.props.onUpdate(href, action, currentElement, {
      ...opts,
      onUpdateCallbacks: this.updateCallbacks,
    });
  };
}

export * from 'hyperview/src/types';
export { Events, Namespaces };
