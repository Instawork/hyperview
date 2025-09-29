/* eslint instawork/flow-annotate: 0 react/prop-types: 0 */
import * as Namespaces from 'hyperview/src/services/namespaces';
// eslint-disable-next-line instawork/import-components
import * as Scroll from 'hyperview/src/components/scroll';
import HvElement from 'hyperview/src/components/hv-element';
import { HvScreenRenderError } from './errors';
import LoadElementError from 'hyperview/src/components/load-element-error';
import React from 'react';

// eslint-disable-next-line instawork/pure-components
export default class HvScreen extends React.Component {
  componentDidMount() {
    // This legacy behavior is required to ensure the document state is updated
    // after the initial load behaviors are applied.
    // See: https://github.com/Instawork/hyperview/pull/1238
    // TODO: remove this once we remove HvDoc localDoc

    this.props.setScreenState({});
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
