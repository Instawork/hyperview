/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Errors from 'hyperview/src/services/navigator/errors';
import * as Navigator from 'hyperview/src/services/navigator';
import * as UrlService from 'hyperview/src/services/url';

import React, { PureComponent } from 'react';
import { Document } from 'hyperview/src/services/navigator/types';
// *** AHG UPDATE LOAD
// import LoadElementError from '../load-element-error';
import LoadError from '../load-error';
import Loading from '../loading';
import { NavigationContext } from 'hyperview/src/contexts/navigation';
import { Props } from './types';
import { RouteRender } from 'hyperview/src/services/navigator/render';

type State = { doc: Document | null; error: Error | null; url: string | null };

/**
 * Properties used for displaying an error
 */
type ErrorProps = {
  error: any;
};

export default class HvRoute extends PureComponent<Props, State> {
  // Defines which context is accessed when using `this.context`
  static contextType = NavigationContext;

  // Defines the type of the context to allow strong typed context access
  declare context: React.ContextType<typeof NavigationContext>;

  parser?: Dom.Parser;

  navigator: Navigator.Logic;

  constructor(props: Props) {
    super(props);

    this.state = {
      doc: null,
      error: null,
      url: null,
    };
    this.navigator = new Navigator.Logic(this.props);
  }

  componentDidMount() {
    if (this.context) {
      this.parser = new Dom.Parser(
        this.context.fetch,
        this.context.onParseBefore || null,
        this.context.onParseAfter || null,
      );
    }

    this.load();
  }

  /**
   * Load the url and resolve the xml.
   */
  load = async (): Promise<void> => {
    if (!this.context || !this.parser) {
      this.setState({
        doc: null,
        error: new Errors.HvRouteError('No parser or context found'),
      });
      return;
    }

    try {
      let url: string =
        this.props.url ||
        this.props.route?.params?.url ||
        this.context.entrypointUrl;
      url = UrlService.getUrlFromHref(url, this.context.entrypointUrl);
      const { doc } = await this.parser.loadDocument(url);
      this.setState({
        doc,
        error: null,
        url,
      });
    } catch (err: any) {
      this.setState({
        doc: null,
        error: err,
        url: null,
      });
    }
  };

  /**
   * View shown while loading
   */
  LoadingView = (): React.ReactElement => {
    const loadingScreen = this.context?.loadingScreen || Loading;
    return React.createElement(loadingScreen);
  };

  /**
   * View shown when there is an error
   */
  ErrorView = (props: ErrorProps): React.ReactElement => {
    const errorScreen = this.context?.errorScreen || LoadError;
    /** *** AHG DO WE RECREATE THE RELOAD  */
    return React.createElement(errorScreen, {
      // back: () => this.getNavigation().back(),
      error: props.error,
      // onPressReload: () => this.reload(), // Make sure reload() is called without any args
      // onPressViewDetails: uri => this.props.openModal({ url: uri }),
    });
  };

  /**
   * View shown when the document is loaded
   */
  ContentView = (): React.ReactElement => {
    if (!this.state.url) {
      throw new Errors.HvRouteError('No url received');
    }
    if (!this.state.doc) {
      throw new Errors.HvRouteError('No document received');
    }
    if (!this.context) {
      throw new Errors.HvRouteError('No context received');
    }

    const { ErrorView } = this;
    try {
      return (
        <RouteRender
          context={this.context}
          doc={this.state.doc}
          navigator={this.navigator}
          props={this.props}
          url={this.state.url}
        />
      );
    } catch (err) {
      return <ErrorView error={err} />;
    }
  };

  render() {
    const { ErrorView, LoadingView, ContentView } = this;
    if (this.state.error) {
      return <ErrorView error={this.state.error} />;
    }
    if (this.state.doc) {
      return <ContentView />;
    }
    return <LoadingView />;
  }
}
