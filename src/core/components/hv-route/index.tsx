/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as DomService from 'hyperview/src/services/dom';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorContext from 'hyperview/src/contexts/navigator';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import * as UrlService from 'hyperview/src/services/url';
import React, { PureComponent, useContext } from 'react';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';

type State = {
  doc: TypesLegacy.Document | null;
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
class HvRouteInner extends PureComponent<Types.InnerRouteProps, State> {
  parser?: DomService.Parser;

  navLogic: NavigatorService.Navigator;

  constructor(props: Types.InnerRouteProps) {
    super(props);

    this.state = {
      doc: null,
      error: null,
      url: null,
    };
    this.navLogic = new NavigatorService.Navigator(this.props);
  }

  componentDidMount() {
    this.parser = new DomService.Parser(
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
        error: new NavigatorService.HvRouteError('No parser or context found'),
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
      throw new NavigatorService.HvRouteError('No url received');
    }
    if (!this.state.doc) {
      throw new NavigatorService.HvRouteError('No document received');
    }

    const { ErrorView } = this;
    try {
      return (
        <NavigatorService.Render
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
export default function HvRoute(props: Types.Props) {
  const navProps: NavigationContext.NavigationContextProps | null = useContext(
    NavigationContext.Context,
  );
  const navCache: NavigatorContext.NavigatorCache | null = useContext(
    NavigatorContext.NavigatorMapContext,
  );
  if (!navProps || !navCache) {
    throw new NavigatorService.HvRouteError('No context found');
  }

  // Retrieve the url from params or from the context
  let url: string | undefined = props.route?.params?.url;
  // Fragment urls are used to designate a route within a document
  if (url && NavigatorService.isUrlFragment(url)) {
    url = navCache.routeMap?.get(NavigatorService.cleanHrefFragment(url));
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
  let element: TypesLegacy.Element | undefined;
  if (props.route?.params.id) {
    element = navCache.elementMap?.get(props.route?.params?.id);
  }

  if (!element) {
    throw new NavigatorService.HvRouteError('No element found');
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

export type {
  InnerRouteProps,
  Props,
  RNTypedNavigationProps,
  RouteParams,
} from './types';
