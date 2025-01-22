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
    this.state = {
      doc: null,
      elementError: null,
      error: null,
      staleHeaderType: null,
      styles: null,
      url: null,
    };
    // Injecting a passed document as a single-use document
    this.initialDoc = props.doc;

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
    this.setState = (...args) => {
      if (args[0].doc !== undefined) {
        this.doc = args[0].doc;
      }
      this.oldSetState(...args);
    };
    // </HACK>

    this.behaviorRegistry = Behaviors.getRegistry(this.props.behaviors);
    this.componentRegistry = new Components.Registry(this.props.components);
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
    const { params } = this.getRoute(this.props);
    // The screen may be rendering via a navigation from another HyperScreen.
    // In this case, the url to load in the screen will be passed via navigation props.
    // Otherwise, use the entrypoint URL provided as a prop to the first HyperScreen.
    const url = params.url || this.props.entrypointUrl || null;

    const preloadScreen = params.preloadScreen
      ? this.props.getElement(params.preloadScreen)
      : null;
    const preloadStyles = preloadScreen
      ? Stylesheets.createStylesheets(preloadScreen)
      : {};

    this.needsLoad = true;
    if (preloadScreen) {
      this.setState({
        doc: preloadScreen,
        elementError: null,
        error: null,
        styles: preloadStyles,
        url,
      });
    } else {
      this.setState({
        elementError: null,
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
  UNSAFE_componentWillReceiveProps = nextProps => {
    const oldNavigationState = this.getRoute(this.props);
    const newNavigationState = this.getRoute(nextProps);

    const newUrl = newNavigationState.params.url;
    const oldUrl = oldNavigationState.params.url;
    const newPreloadScreen = newNavigationState.params.preloadScreen;
    const oldPreloadScreen = oldNavigationState.params.preloadScreen;
    const newElementId = newNavigationState.params.behaviorElementId;
    const oldElementId = oldNavigationState.params.behaviorElementId;

    if (newPreloadScreen !== oldPreloadScreen && oldPreloadScreen) {
      this.props.removeElement?.(oldPreloadScreen);
    }

    if (newElementId !== oldElementId && oldElementId) {
      this.props.removeElement?.(oldElementId);
    }

    if (newUrl && newUrl !== oldUrl) {
      this.needsLoad = true;

      const preloadScreen = newPreloadScreen
        ? this.props.getElement(newPreloadScreen)
        : null;

      const doc = preloadScreen || this.doc;
      const styles = preloadScreen
        ? Stylesheets.createStylesheets(preloadScreen)
        : // eslint-disable-next-line react/no-access-state-in-setstate
          this.state.styles;

      this.setState({ doc, styles, url: newUrl });
    }
  };

  /**
   * Clear out the preload screen associated with this screen.
   */
  componentWillUnmount() {
    const { params } = this.getRoute(this.props);
    const { behaviorElementId, preloadScreen } = params;

    if (preloadScreen) {
      this.props.removePreload?.(preloadScreen);
    }
    if (behaviorElementId) {
      this.props.removePreload?.(behaviorElementId);
    }
  }

  /**
   * Fetch data from the url if the screen should reload.
   */
  componentDidUpdate() {
    if (this.needsLoad) {
      this.load(this.state.url);
      this.needsLoad = false;
    }
  }

  /**
   * Performs a full load of the screen.
   */
  load = async () => {
    const { params } = this.getRoute(this.props);

    try {
      // If an initial document was passed, use it once and then remove
      let doc;
      let staleHeaderType;
      if (this.initialDoc) {
        doc = this.initialDoc;
        this.initialDoc = null;
      } else {
        if (params.delay) {
          await later(parseInt(params.delay, 10));
        }

        // eslint-disable-next-line react/no-access-state-in-setstate
        const {
          doc: loadedDoc,
          staleHeaderType: loadedType,
        } = await this.parser.loadDocument(this.state.url);
        doc = loadedDoc;
        staleHeaderType = loadedType;
      }
      const stylesheets = Stylesheets.createStylesheets(doc);
      this.setState({
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
      this.setState({
        doc: null,
        elementError: null,
        error: err,
        styles: null,
      });
    } finally {
      if (params.preloadScreen) {
        this.props.removePreload?.(params.preloadScreen);
      }
      if (params.behaviorElementId) {
        this.props.removePreload?.(params.behaviorElementId);
      }
    }
  };

  /**
   * Reload if an error occured using the screen's current URL
   */
  reload = () => {
    this.props.reload(this.state.url, {
      onUpdateCallbacks: this.updateCallbacks,
    });
  };

  /**
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  render() {
    if (this.state.error) {
      const errorScreen = this.props.errorScreen || LoadError;
      return React.createElement(errorScreen, {
        back: () => this.getNavigation().back(),
        error: this.state.error,
        onPressReload: () => this.reload(), // Make sure reload() is called without any args
        onPressViewDetails: uri => this.props.openModal({ url: uri }),
      });
    }
    if (!this.state.doc) {
      return <Loading cachedId={this.props.route?.params?.behaviorElementId} />;
    }
    const elementErrorComponent = this.state.elementError
      ? this.props.elementErrorComponent || LoadElementError
      : null;
    const [body] = Array.from(
      this.state.doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body'),
    );
    const screenElement = Render.renderElement(
      body,
      this.state.styles,
      this.onUpdate,
      {
        componentRegistry: this.componentRegistry,
        onUpdateCallbacks: this.updateCallbacks,
        screenUrl: this.state.url,
        staleHeaderType: this.state.staleHeaderType,
      },
    );

    return (
      <Contexts.DocContext.Provider
        value={{
          getDoc: () => this.doc,
        }}
      >
        <Contexts.DateFormatContext.Provider value={this.props.formatDate}>
          {elementErrorComponent
            ? React.createElement(elementErrorComponent, {
                error: this.state.elementError,
                onPressClose: () => this.setState({ elementError: null }),
                onPressReload: () => this.reload(),
              })
            : null}
          {screenElement}
        </Contexts.DateFormatContext.Provider>
      </Contexts.DocContext.Provider>
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

  setElement = (id, element) => {
    if (this.props.setElement) {
      this.props.setElement(id, element);
    }
  };

  /**
   * Implement the callbacks from this class
   */
  updateCallbacks = {
    clearElementError: () => {
      if (this.state.elementError) {
        this.setState({ elementError: null });
      }
    },
    getDoc: () => this.doc,
    getNavigation: () => this.navigation,
    getOnUpdate: () => this.onUpdate,
    getState: () => this.state,
    setElement: (id, element) => this.setElement(id, element),
    setNeedsLoad: () => {
      this.needsLoad = true;
    },
    setState: state => {
      this.setState(state);
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
