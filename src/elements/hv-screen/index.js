/* eslint instawork/flow-annotate: 0 react/prop-types: 0 */
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
// eslint-disable-next-line instawork/import-components
import * as Scroll from 'hyperview/src/components/scroll';
import { createProps, createStyleProp } from 'hyperview/src/services';
import HvElement from 'hyperview/src/components/hv-element';
import { HvScreenRenderError } from './errors';
import LoadElementError from 'hyperview/src/components/load-element-error';
import React from 'react';

// eslint-disable-next-line instawork/pure-components
export default class HvScreen extends React.Component {
  static createProps = createProps;

  static createStyleProp = createStyleProp;

  static renderChildren = Render.renderChildren;

  static renderElement = Render.renderElement;

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
