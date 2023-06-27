/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from 'hyperview/src/contexts';
import * as DomService from 'hyperview/src/services/dom';
import * as Helpers from 'hyperview/src/services/dom/helpers-legacy';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorContext from 'hyperview/src/contexts/navigator';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import * as UrlService from 'hyperview/src/services/url';
import React, { PureComponent, useContext } from 'react';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';

/**
 * Implementation of an HvRoute component
 * Performs the following:
 * - Loads the document
 * - Renders the document
 * - Handles errors
 */
class HvRouteInner extends PureComponent<Types.InnerRouteProps, Types.State> {
  parser?: DomService.Parser;

  navLogic: NavigatorService.Navigator;

  constructor(props: Types.InnerRouteProps) {
    super(props);

    this.state = {
      doc: undefined,
      error: undefined,
    };
    this.navLogic = new NavigatorService.Navigator(this.props);
  }

  componentDidMount() {
    this.parser = new DomService.Parser(
      this.props.fetch,
      this.props.onParseBefore || null,
      this.props.onParseAfter || null,
    );

    // When a nested navigator is found, the document is not loaded from url
    if (this.props.element === undefined) {
      this.load();
    }
  }

  componentDidUpdate(prevProps: Types.InnerRouteProps) {
    if (prevProps.url !== this.props.url) {
      this.load();
    }
  }

  getUrl = (): string => {
    return UrlService.getUrlFromHref(
      this.props.url || this.props.entrypointUrl,
      this.props.entrypointUrl,
    );
  };

  /**
   * Load the url and resolve the xml.
   */
  load = async (): Promise<void> => {
    if (!this.parser) {
      this.setState({
        doc: undefined,
        error: new NavigatorService.HvRouteError('No parser or context found'),
      });
      return;
    }

    try {
      const url: string = this.getUrl();

      const { doc } = await this.parser.loadDocument(url);
      this.setState({
        doc,
        error: undefined,
      });
    } catch (err: unknown) {
      this.setState({
        doc: undefined,
        error: err as Error,
      });
    }
  };

  getRenderElement = (
    props: Types.RouteRenderProps,
  ): TypesLegacy.Element | null => {
    if (props.element) {
      return props.element;
    }
    if (!props.doc) {
      throw new NavigatorService.HvRenderError('No document found');
    }

    // Get the <doc> element
    const root: TypesLegacy.Element | null = Helpers.getFirstTag(
      props.doc,
      TypesLegacy.LOCAL_NAME.DOC,
    );
    if (!root) {
      throw new NavigatorService.HvRenderError('No root element found');
    }

    // Get the first child as <screen> or <navigator>
    const screenElement: TypesLegacy.Element | null = Helpers.getFirstTag(
      root,
      TypesLegacy.LOCAL_NAME.SCREEN,
    );
    if (screenElement) {
      return screenElement;
    }

    const navigatorElement: TypesLegacy.Element | null = Helpers.getFirstTag(
      root,
      TypesLegacy.LOCAL_NAME.NAVIGATOR,
    );
    if (navigatorElement) {
      return navigatorElement;
    }

    throw new NavigatorService.HvRenderError(
      'No <screen> or <navigator> element found',
    );
  };

  /**
   * View shown while loading
   */
  Load = (): React.ReactElement => {
    const LoadingScreen = this.props.loadingScreen || Loading;
    return <LoadingScreen />;
  };

  /**
   * View shown when there is an error
   */
  Error = (props: { error: unknown }): React.ReactElement => {
    const ErrorScreen = this.props.errorScreen || LoadError;
    return (
      <ErrorScreen
        back={() => this.navLogic.back({})}
        error={props.error}
        onPressReload={() => this.load()}
        onPressViewDetails={(uri: string | undefined) => {
          this.navLogic.openModal({ url: uri });
        }}
      />
    );
  };

  /**
   * Build the <HvScreen> component with injected props
   */
  Screen = (props: Types.BuildScreenProps): React.ReactElement => {
    // Inject the corrected url into the params and cast as correct type
    const route: Types.RouteProps = {
      ...props.routeProps.route,
      key: props.routeProps.route?.key || 'hv-screen',
      name: props.routeProps.route?.name || 'hv-screen',
      params: {
        ...props.routeProps.route?.params,
        url: props.url || undefined,
      },
    };

    return (
      <Contexts.DateFormatContext.Consumer>
        {formatter => (
          <HvScreen
            back={props.navLogic.back}
            behaviors={props.routeProps.behaviors}
            closeModal={props.navLogic.closeModal}
            components={props.routeProps.components}
            doc={props.doc}
            elementErrorComponent={props.routeProps.elementErrorComponent}
            entrypointUrl={props.routeProps.entrypointUrl}
            errorScreen={props.routeProps.errorScreen}
            fetch={props.routeProps.fetch}
            formatDate={formatter}
            loadingScreen={props.routeProps.loadingScreen}
            navigate={props.navLogic.navigate}
            navigation={props.routeProps.navigation}
            onParseAfter={props.routeProps.onParseAfter}
            onParseBefore={props.routeProps.onParseBefore}
            openModal={props.navLogic.openModal}
            push={props.navLogic.push}
            route={route}
            url={props.url || undefined}
          />
        )}
      </Contexts.DateFormatContext.Consumer>
    );
  };

  /**
   * Evaluate the <doc> element and render the appropriate component
   */
  Route = (props: Types.RouteRenderProps): React.ReactElement => {
    const renderElement: TypesLegacy.Element | null = this.getRenderElement(
      props,
    );

    if (!renderElement) {
      throw new NavigatorService.HvRenderError('No element found');
    }

    if (renderElement.namespaceURI !== Namespaces.HYPERVIEW) {
      throw new NavigatorService.HvRenderError('Invalid namespace');
    }

    if (renderElement.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR) {
      return <HvNavigator element={renderElement} />;
    }
    const { Screen } = this;

    if (renderElement.localName === TypesLegacy.LOCAL_NAME.SCREEN) {
      if (props.routeProps.handleBack) {
        return (
          <props.routeProps.handleBack>
            <Screen
              doc={props.doc}
              navLogic={props.navLogic}
              routeProps={props.routeProps}
              url={props.url}
            />
          </props.routeProps.handleBack>
        );
      }
      return (
        <Screen
          doc={props.doc}
          navLogic={props.navLogic}
          routeProps={props.routeProps}
          url={props.url}
        />
      );
    }

    throw new NavigatorService.HvRenderError('Invalid element type');
  };

  /**
   * View shown when the document is loaded
   */
  Content = (): React.ReactElement => {
    if (this.props.element === undefined) {
      if (!this.props.url) {
        throw new NavigatorService.HvRouteError('No url received');
      }
      if (!this.state.doc) {
        throw new NavigatorService.HvRouteError('No document received');
      }
    }

    const { Error, Route } = this;
    try {
      return (
        <Route
          doc={this.state.doc}
          element={this.props.element}
          navLogic={this.navLogic}
          routeProps={this.props}
          url={this.getUrl()}
        />
      );
    } catch (err) {
      return <Error error={err} />;
    }
  };

  render() {
    const { Error, Load, Content } = this;
    if (this.state.error) {
      return <Error error={this.state.error} />;
    }
    if (this.props.element || this.state.doc) {
      return <Content />;
    }
    return <Load />;
  }
}

/**
 * Functional component wrapper around HvRouteInner
 * NOTE: The reason for this approach is to allow accessing
 *  multiple contexts to pass data to HvRouteInner
 * Performs the following:
 * - Retrieves the url from the props, params, or context
 * - Retrieves the navigator element from the context
 * - Passes the props, context, and url to HvRouteInner
 */
export default function HvRoute(props: Types.Props) {
  const navigationContext: Types.NavigationContextProps | null = useContext(
    NavigationContext.Context,
  );
  const navigatorContext: Types.NavigatorContextProps | null = useContext(
    NavigatorContext.NavigatorMapContext,
  );
  if (!navigationContext || !navigatorContext) {
    throw new NavigatorService.HvRouteError('No context found');
  }

  // Retrieve the url from params or from the context
  let url: string | undefined = props.route?.params?.url;
  // Fragment urls are used to designate a route within a document
  if (url && NavigatorService.isUrlFragment(url)) {
    // Look up the url from the route map where it would have been
    //  stored from the initial <nav-route> definition
    url = navigatorContext.routeMap?.get(
      NavigatorService.cleanHrefFragment(url),
    );
  }

  if (!url) {
    // Use the route id if available to look up the url
    if (props.route?.params?.id) {
      url = navigatorContext.routeMap?.get(props.route.params.id);
    } else if (navigatorContext.initialRouteName) {
      // Try to use the initial route for this <navigator>
      url = navigatorContext.routeMap?.get(navigatorContext.initialRouteName);
    }
  }

  // Fall back to the entrypoint url
  url = url || navigationContext.entrypointUrl;

  const id: string | undefined =
    props.route?.params?.id || navigatorContext.initialRouteName || undefined;

  const { index, type } = props.navigation?.getState() || {};
  // The nested element is only used when the navigator is not a stack
  //    or is the first screen in a stack. Other stack screens will require a url
  const includeElement: boolean =
    type !== NavigatorService.NAVIGATOR_TYPE.STACK || index === 0;

  // Get the navigator element from the context
  const element: TypesLegacy.Element | undefined =
    id && includeElement ? navigatorContext.elementMap?.get(id) : undefined;

  return (
    <HvRouteInner
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...{ ...props, ...navigationContext, ...navigatorContext }}
      element={element}
      url={url}
    />
  );
}

export type { Props, RNTypedNavigationProps } from './types';
