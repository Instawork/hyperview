/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as UrlService from 'hyperview/src/services/url';
import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { DataProps } from 'hyperview/src/core/components/hv-route/types';
import { Document } from 'hyperview/src/core/components/hv-navigator/types';
import LoadElementError from 'hyperview/src/core/components/load-element-error';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
import {
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';

import { Parser } from 'hyperview/src/services/dom';

type Props = DataProps;
type State = { doc: Document | null; error: Error | null };

export default class HvRoute extends PureComponent<Props, State> {
  // // static contextType = NavigationContext;
  // declare context: React.ContextType<typeof NavigationContext>;

  parser?: Parser;

  constructor(props: Props) {
    super(props);
    if (this.context) {
      this.parser = new Parser(
        this.context.fetch,
        this.context?.onParseBefore || null,
        this.context?.onParseAfter || null,
      );
    }

    this.state = {
      doc: null,
      error: null,
    };
  }

  componentDidMount() {
    this.load();
  }

  /**
   * Load the url and resolve the xml.
   */
  load = async () => {
    if (!this.context || !this.parser) {
      this.setState({ doc: null, error: new Error('No context or parser') });
      return;
    }

    try {
      let url: string = this.props.url || this.context.entrypointUrl;

      url = UrlService.getUrlFromHref(url, this.context.entrypointUrl);
      console.log('--------> url', url);

      const { doc } = await this.parser.loadDocument(url);
      // console.log('--------> doc');
      this.setState({
        doc: doc,
        error: null,
      });
    } catch (err: any) {
      console.log('--------> err', err);
      this.setState({
        doc: null,
        error: err,
      });
    }
  };

  /**
   * View shown while loading
   * @param contextValue
   * @returns the element to render
   */
  LoadingView = (contextValue: NavigationContextProps | null) => {
    const loadingScreen = contextValue?.loadingScreen || Loading;
    return React.createElement(loadingScreen);
  };

  /**
   * View shown when there is an error
   * @param contextValue
   * @param error
   * @returns the element to render
   */
  ErrorView = (contextValue: NavigationContextProps | null, error: Error) => {
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
   * @param contextValue
   * @returns the element to render
   */
  ContentView = (contextValue: NavigationContextProps | null) => {
    return (
      <View>
        <Text>
          ROUTE:{this.state.doc?.toString()}:{contextValue?.entrypointUrl}:
        </Text>
      </View>
    );
  };

  render() {
    return (
      <NavigationContext.Consumer>
        {contextValue =>
          this.state.error
            ? this.ErrorView(contextValue, this.state.error)
            : this.state.doc
            ? this.ContentView(contextValue)
            : this.LoadingView(contextValue)
        }
      </NavigationContext.Consumer>
    );
  }
}
