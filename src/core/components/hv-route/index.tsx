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

import { Document, Element } from 'hyperview/src/types-legacy';
import { InnerRouteProps, Props } from './types';
import {
  NavigationContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import React, { PureComponent, useContext } from 'react';
import {
  cleanHrefFragment,
  isUrlFragment,
} from 'hyperview/src/services/navigator/helpers';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
import type { NavigatorCache } from 'hyperview/src/contexts/navigator';
import { NavigatorMapContext } from 'hyperview/src/contexts/navigator';
import { Route } from 'hyperview/src/services/navigator/render';

type State = {
  doc: Document | null;
  error: Error | null;
  url: string | null;
};

/**
 * Implementation of an HvRoute component
 * Performs the following:
 * - Loads the document
 * - Renders the document
 * - Handles errors
 */
class HvRouteInner extends PureComponent<InnerRouteProps, State> {
  parser?: Dom.Parser;

  navLogic: Navigator.Logic;

  constructor(props: InnerRouteProps) {
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
    } catch (err: unknown) {
      this.setState({
        doc: null,
        error: err as Error,
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
    return React.createElement(errorScreen, {
      back: () => this.navLogic.back({}),
      error: props.error,
      onPressReload: () => this.load(),
      onPressViewDetails: (uri: string | undefined) => {
        this.navLogic.openModal({ url: uri });
      },
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
        <Route
          doc={this.state.doc}
          element={this.props.element}
          navLogic={this.navLogic}
          routeProps={this.props}
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

/**
 * Functional component wrapper around HvRouteInner
 * Performs the following:
 * - Retrieves the url from the props, params, or context
 * - Retrieves the navigator element from the context
 * - Passes the props, context, and url to HvRouteInner
 */
export default function HvRoute(props: Props) {
  const navProps: NavigationContextProps | null = useContext(NavigationContext);
  const navCache: NavigatorCache | null = useContext(NavigatorMapContext);
  if (!navProps || !navCache) {
    throw new Errors.HvRouteError('No context found');
  }

  // Retrieve the url from params or from the context
  let url: string | undefined = props.route?.params?.url;
  // Fragment urls are used to designate a route within a document
  if (url && isUrlFragment(url)) {
    url = navCache.routeMap?.get(cleanHrefFragment(url));
  }

  if (!url) {
    // Use the route id if available to look up the url
    if (props.route?.params?.id) {
      url = navCache.routeMap?.get(props.route.params.id);
    } else {
      // Try to use the initial route for this <navigator>
      const initialRoute: string | undefined = navCache.initialRouteName;
      if (initialRoute) {
        url = navCache.routeMap?.get(initialRoute);
      }
    }
  }

  // Fall back to the entrypoint url
  url = url || navProps.entrypointUrl;

  // Get the navigator element from the context
  let element: Element | undefined;
  if (props.route?.params.id) {
    element = navCache.elementMap?.get(props.route?.params?.id);
  }

  return (
    <HvRouteInner
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...{ ...props, ...navProps, ...navCache }}
      element={element}
      url={url}
    />
  );
}
