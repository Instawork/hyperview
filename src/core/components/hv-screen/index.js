/* eslint instawork/flow-annotate: 0 */
import * as Behaviors from 'hyperview/src/behaviors';
import * as Components from 'hyperview/src/services/components';
import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import * as Scroll from 'hyperview/src/core/components/scroll';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import { createProps, createStyleProp, later } from 'hyperview/src/services';
import { HvScreenRenderError } from './errors';
import LoadElementError from '../load-element-error';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
import React from 'react';

// eslint-disable-next-line instawork/pure-components
class HvScreenInner extends React.Component {
  static createProps = createProps;

  static createStyleProp = createStyleProp;

  static renderChildren = Render.renderChildren;

  static renderElement = Render.renderElement;

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);

    this.parser = new Dom.Parser(
      this.props.fetch,
      this.props.onParseBefore,
      this.props.onParseAfter,
    );

    this.needsLoad = false;
    // Injecting a passed document as a single-use document
    this.initialDoc = props.doc;

    this.behaviorRegistry = Behaviors.getRegistry(this.props.behaviors);
    this.componentRegistry = new Components.Registry(this.props.components);
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
      this.props.setState({
        doc: preloadScreen,
        elementError: null,
        error: null,
        styles: preloadStyles,
        url,
      });
    } else {
      this.props.setState({
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

      const doc = preloadScreen || this.props.getLocalDoc();
      const styles = preloadScreen
        ? Stylesheets.createStylesheets(preloadScreen)
        : // eslint-disable-next-line react/no-access-state-in-setstate
          this.props.getState().styles;

      this.props.setState({ doc, styles, url: newUrl });
    }
  };

  /**
   * Clear out the preload screen associated with this screen.
   */
  componentWillUnmount() {
    const { params } = this.getRoute(this.props);
    const { behaviorElementId, preloadScreen } = params;

    if (preloadScreen) {
      this.props.removeElement?.(preloadScreen);
    }
    if (behaviorElementId) {
      this.props.removeElement?.(behaviorElementId);
    }
  }

  /**
   * Fetch data from the url if the screen should reload.
   */
  componentDidUpdate() {
    if (this.needsLoad) {
      this.load(this.props.getState().url);
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
        } = await this.parser.loadDocument(this.props.getState().url);
        doc = loadedDoc;
        staleHeaderType = loadedType;
      }
      const stylesheets = Stylesheets.createStylesheets(doc);
      this.props.setState({
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
      this.props.setState({
        doc: null,
        elementError: null,
        error: err,
        styles: null,
      });
    } finally {
      if (params.preloadScreen) {
        this.props.removeElement?.(params.preloadScreen);
      }
      if (params.behaviorElementId) {
        this.props.removeElement?.(params.behaviorElementId);
      }
    }
  };

  /**
   * Reload if an error occured using the screen's current URL
   */
  reload = () => {
    this.props.reload(this.props.getState().url, {
      onUpdateCallbacks: this.updateCallbacks,
    });
  };

  Error = ({ error }) => {
    const errorScreen = this.props.errorScreen || LoadError;
    return React.createElement(errorScreen, {
      back: () => this.props.navigation.backAction(),
      error,
      onPressReload: () => this.reload(), // Make sure reload() is called without any args
      onPressViewDetails: uri =>
        this.props.navigation.openModalAction({ url: uri }),
    });
  };

  /**
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  render() {
    const { Error } = this;
    if (this.props.getState().error) {
      return <Error error={this.props.getState().error} />;
    }
    if (!this.props.getState().doc) {
      return <Loading cachedId={this.props.route?.params?.behaviorElementId} />;
    }
    const elementErrorComponent = this.props.getState().elementError
      ? this.props.elementErrorComponent || LoadElementError
      : null;
    const [body] = Array.from(
      this.props
        .getState()
        .doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body'),
    );
    let screenElement;
    if (body) {
      screenElement = Render.renderElement(
        body,
        this.props.getState().styles,
        this.onUpdate,
        {
          componentRegistry: this.componentRegistry,
          onUpdateCallbacks: this.updateCallbacks,
          screenUrl: this.props.getState().url,
          staleHeaderType: this.props.getState().staleHeaderType,
        },
      );
    }
    if (!screenElement) {
      return (
        <Error
          error={new HvScreenRenderError('The document has no content.')}
        />
      );
    }

    return (
      <Contexts.DocContext.Provider
        value={{
          getDoc: () => this.props.getLocalDoc(),
        }}
      >
        <Contexts.DateFormatContext.Provider value={this.props.formatDate}>
          {elementErrorComponent
            ? React.createElement(elementErrorComponent, {
                error: this.props.getState().elementError,
                onPressClose: () => this.props.setState({ elementError: null }),
                onPressReload: () => this.reload(),
              })
            : null}
          <Scroll.Provider>{screenElement}</Scroll.Provider>
        </Contexts.DateFormatContext.Provider>
      </Contexts.DocContext.Provider>
    );
  }

  /**
   * Implement the callbacks from this class
   */
  updateCallbacks = {
    clearElementError: () => {
      if (this.props.getState().elementError) {
        this.props.setState({ elementError: null });
      }
    },
    getDoc: () => this.props.getLocalDoc(),
    getNavigation: () => this.props.navigation,
    getOnUpdate: () => this.onUpdate,
    getState: () => this.props.getState(),
    setNeedsLoad: () => {
      this.needsLoad = true;
    },
    setState: state => {
      this.props.setState(state);
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

export default function HvScreen(props) {
  return (
    <HvScreenInner
      {...props}
      setState={newState => {
        if (newState.doc !== undefined) {
          props.setLocalDoc(newState.doc);
        }
        props.setState(newState);
      }}
    />
  );
}

export * from 'hyperview/src/types';
export { Events, Namespaces };
