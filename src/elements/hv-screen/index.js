/* eslint instawork/flow-annotate: 0 react/prop-types: 0 */
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import * as Scroll from 'hyperview/src/core/components/scroll';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import { createProps, createStyleProp } from 'hyperview/src/services';
import HvElement from 'hyperview/src/core/components/hv-element';
import { HvScreenRenderError } from './errors';
import LoadElementError from 'hyperview/src/core/components/load-element-error';
import React from 'react';

// eslint-disable-next-line instawork/pure-components
export default class HvScreen extends React.Component {
  static createProps = createProps;

  static createStyleProp = createStyleProp;

  static renderChildren = Render.renderChildren;

  static renderElement = Render.renderElement;

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

    if (preloadScreen && !this.props.getScreenState().doc) {
      this.props.setScreenState({
        doc: preloadScreen,
        elementError: null,
        error: null,
        styles: preloadStyles,
        url,
      });
    } else {
      this.props.setScreenState({
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
      const preloadScreen = newPreloadScreen
        ? this.props.getElement(newPreloadScreen)
        : null;

      const doc = preloadScreen || this.props.getLocalDoc();
      const styles = preloadScreen
        ? Stylesheets.createStylesheets(preloadScreen)
        : // eslint-disable-next-line react/no-access-state-in-setstate
          this.props.getScreenState().styles;

      this.props.setScreenState({ doc, styles, url: newUrl });
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
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  render() {
    const elementErrorComponent = this.props.getScreenState().elementError
      ? this.props.elementErrorComponent || LoadElementError
      : null;
    const [body] = Array.from(
      this.props
        .getScreenState()
        .doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body'),
    );
    let screenElement;
    if (body) {
      screenElement = (
        <HvElement
          element={body}
          onUpdate={this.props.onUpdate}
          options={{
            componentRegistry: this.props.componentRegistry,
            onUpdateCallbacks: this.props.onUpdateCallbacks,
            screenUrl: this.props.getScreenState().url,
            staleHeaderType: this.props.getScreenState().staleHeaderType,
          }}
          stylesheets={this.props.getScreenState().styles}
        />
      );
    }
    if (!screenElement) {
      throw new HvScreenRenderError('The document has no content.');
    }

    return (
      <>
        {elementErrorComponent
          ? React.createElement(elementErrorComponent, {
              error: this.props.getScreenState().elementError,
              onPressClose: () =>
                this.props.setScreenState({ elementError: null }),
              onPressReload: () => this.props.reload(),
            })
          : null}
        <Scroll.Provider>{screenElement}</Scroll.Provider>
      </>
    );
  }
}

export * from 'hyperview/src/types';
export { Events, Namespaces };
