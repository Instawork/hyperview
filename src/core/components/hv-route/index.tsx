/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Props } from './types';
import * as Render from 'hyperview/src/services/navigator/render';
import * as UrlService from 'hyperview/src/services/url';
import React, { PureComponent } from 'react';
import { Document, Node } from 'hyperview/src/services/navigator/types';
// import LoadElementError from '../load-element-error';
import LoadError from '../load-error';
import Loading from '../loading';
import {
  DateFormatContext,
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import { Parser } from 'hyperview/src/services/dom';

type State = { url: string | null; doc: Document | null; error: Error | null };

export default class HvRoute extends PureComponent<Props, State> {
  // // static contextType = NavigationContext;
  // declare context: React.ContextType<typeof NavigationContext>;

  parser?: Parser;

  constructor(props: Props) {
    super(props);

    this.state = {
      url: null,
      doc: null,
      error: null,
    };
  }

  componentDidMount() {
    if (this.context) {
      this.parser = new Parser(
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
      this.setState({ doc: null, error: new Error('No context or parser') });
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
        url,
        doc,
        error: null,
      });
    } catch (err: any) {
      this.setState({
        url: null,
        doc: null,
        error: err,
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
      return Render.renderElement(url, doc, navContext, this.props);
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
