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

import {
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import React, { PureComponent } from 'react';
import { Document } from 'hyperview/src/services/navigator/types';
// *** AHG UPDATE LOAD
// import LoadElementError from '../load-element-error';
import LoadError from '../load-error';
import Loading from '../loading';

import { Props } from './types';
import { renderElement } from 'hyperview/src/services/navigator/render';

type State = { doc: Document | null; error: Error | null; url: string | null };

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
      console.log('--------> url', url);
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
   * @param navContext
   * @returns the element to render
   */
  LoadingView = (
    navContext: NavigationContextProps | null,
  ): React.ReactElement => {
    const loadingScreen = navContext?.loadingScreen || Loading;
    return React.createElement(loadingScreen);
  };

  /**
   * View shown when there is an error
   * @param navContext
   * @param error
   * @returns the element to render
   */
  ErrorView = (
    error: Error,
    navContext: NavigationContextProps | null,
  ): React.ReactElement => {
    const errorScreen = contextValue?.errorScreen || LoadError;
    /** DO WE RECREATE THE RELOAD  */
    return React.createElement(errorScreen, {
      // back: () => this.getNavigation().back(),
      error,
      // onPressReload: () => this.reload(), // Make sure reload() is called without any args
      // onPressViewDetails: uri => this.props.openModal({ url: uri }),
    });
  };

  /**
   * View shown when the document is loaded
   * @param navContext
   * @returns the element to render
   */
  ContentView = (
    url: string | null,
    doc: Document,
    navContext: NavigationContextProps | null,
  ): React.ReactElement => {
    try {
      return renderElement(url, doc, navContext, this.navigator);
    } catch (err: any) {
      return this.ErrorView(err, navContext);
    }
  };

  render() {
    return (
      <NavigationContext.Consumer>
        {navContext =>
          this.state.error
            ? this.ErrorView(this.state.error, navContext)
            : this.state.doc
            ? this.ContentView(this.state.url, this.state.doc, navContext)
            : this.LoadingView(navContext)
        }
      </NavigationContext.Consumer>
    );
  }
}
