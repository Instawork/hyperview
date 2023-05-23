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
  GetInitialRouteName,
  GetRouteUrl,
  NavigatorCache,
  NavigatorMapContext,
} from 'hyperview/src/contexts/navigator';
import {
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import { Props, RouteParams } from './types';
import React, { PureComponent, useContext } from 'react';
import { Document } from 'hyperview/src/services/navigator/types';
// *** AHG UPDATE LOAD
// import LoadElementError from '../load-element-error';
import LoadError from '../load-error';
import Loading from '../loading';

import { RouteRender } from 'hyperview/src/services/navigator/render';

type State = { doc: Document | null; error: Error | null; url: string | null };

class HvRouteInner extends PureComponent<RouteParams, State> {
  parser?: Dom.Parser;

  navLogic: Navigator.Logic;

  constructor(props: RouteParams) {
    super(props);

    this.state = {
      doc: null,
      error: null,
      url: null,
    };
    this.navLogic = new Navigator.Logic(this.props);
  }

  componentDidMount() {
    this.parser = new Dom.Parser(
      this.props.fetch,
      this.props.onParseBefore || null,
      this.props.onParseAfter || null,
    );

    this.load();
  }

  /**
   * Load the url and resolve the xml.
   */
  load = async (): Promise<void> => {
    if (!this.parser) {
      this.setState({
        doc: null,
        error: new Errors.HvRouteError('No parser or context found'),
      });
      return;
    }

    try {
      const url: string = UrlService.getUrlFromHref(
        this.props.url || this.props.entrypointUrl,
        this.props.entrypointUrl,
      );

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
    const loadingScreen = this.props.loadingScreen || Loading;
    return React.createElement(loadingScreen);
  };

  /**
   * View shown when there is an error
   */
  ErrorView = (props: { error: unknown }): React.ReactElement => {
    const errorScreen = this.props.errorScreen || LoadError;
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

    const { ErrorView } = this;
    try {
      return (
        <RouteRender
          doc={this.state.doc}
          navLogic={this.navLogic}
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

export default function HvRoute(props: Props) {
  const contextProps: NavigationContextProps | null = useContext(
    NavigationContext,
  );
  const mapState: NavigatorCache | null = useContext(NavigatorMapContext);
  if (!contextProps) {
    throw new Errors.HvRouteError('No context found');
  }

  // Retrieve the url from props, params, or from the context
  let url: string | undefined = props.route?.params?.url;
  if (!url) {
    // Use the id if available to look up the url
    if (props.route?.params?.id) {
      url = GetRouteUrl(props.route.params.id);
    } else {
      // Try to use the initial route
      const initialRoute: string | undefined = GetInitialRouteName();
      if (initialRoute) {
        url = GetRouteUrl(initialRoute);
      }
    }
  }
  url = url || contextProps.entrypointUrl;

  return (
    <HvRouteInner
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...{ ...props, ...contextProps, ...mapState }}
      url={url}
    />
  );
}
