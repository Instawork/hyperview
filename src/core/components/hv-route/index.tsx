/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Components from 'hyperview/src/services/components';
import * as Contexts from 'hyperview/src/contexts';
import * as DomService from 'hyperview/src/services/dom';
import * as Helpers from 'hyperview/src/services/dom/helpers-legacy';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorMapContext from 'hyperview/src/contexts/navigator-map';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import * as UrlService from 'hyperview/src/services/url';
import React, {
  ComponentType,
  JSXElementConstructor,
  PureComponent,
  ReactNode,
  useContext,
} from 'react';
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

  componentRegistry: TypesLegacy.ComponentRegistry;

  constructor(props: Types.InnerRouteProps) {
    super(props);

    this.state = {
      doc: undefined,
      error: undefined,
    };
    this.navLogic = new NavigatorService.Navigator(this.props);
    this.componentRegistry = Components.getRegistry(this.props.components);
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
      if (this.props.onError) {
        this.props.onError(err as Error);
      }
      this.setState({
        doc: undefined,
        error: err as Error,
      });
    }
  };

  getRenderElement = (): TypesLegacy.Element | null => {
    if (this.props.element) {
      return this.props.element;
    }
    if (!this.state.doc) {
      throw new NavigatorService.HvRenderError('No document found');
    }

    // Get the <doc> element
    const root: TypesLegacy.Element | null = Helpers.getFirstTag(
      this.state.doc,
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

  registerPreload = (id: number, element: TypesLegacy.Element): void => {
    this.props.setPreload(id, element);
  };

  /**
   * View shown while loading
   * Includes preload functionality
   */
  Load = (): React.ReactElement => {
    if (this.props.route?.params?.preloadScreen) {
      const preloadElement = this.props.getPreload(
        this.props.route?.params?.preloadScreen,
      );
      if (preloadElement) {
        const [body] = Array.from(
          preloadElement.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body'),
        );
        const styleSheet = Stylesheets.createStylesheets(preloadElement);
        const component:
          | string
          | React.ReactElement<unknown, string | JSXElementConstructor<unknown>>
          | undefined = Render.renderElement(body, styleSheet, null, {
          componentRegistry: this.componentRegistry,
        });
        if (component) {
          return <>{component}</>;
        }
      }
    }
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
  Screen = (): React.ReactElement => {
    const url = this.getUrl();
    // Inject the corrected url into the params and cast as correct type
    const route: Types.RouteProps = {
      ...this.props.route,
      key: this.props.route?.key || 'hv-screen',
      name: this.props.route?.name || 'hv-screen',
      params: {
        ...this.props.route?.params,
        url: url || undefined,
      },
    };

    return (
      <Contexts.DateFormatContext.Consumer>
        {formatter => (
          <HvScreen
            back={this.navLogic.back}
            behaviors={this.props.behaviors}
            closeModal={this.navLogic.closeModal}
            components={this.props.components}
            doc={this.state.doc?.cloneNode(true)}
            elementErrorComponent={this.props.elementErrorComponent}
            entrypointUrl={this.props.entrypointUrl}
            errorScreen={this.props.errorScreen}
            fetch={this.props.fetch}
            formatDate={formatter}
            loadingScreen={this.props.loadingScreen}
            navigate={this.navLogic.navigate}
            navigation={this.props.navigation}
            onParseAfter={this.props.onParseAfter}
            onParseBefore={this.props.onParseBefore}
            openModal={this.navLogic.openModal}
            push={this.navLogic.push}
            registerPreload={this.registerPreload}
            route={route}
            url={url || undefined}
          />
        )}
      </Contexts.DateFormatContext.Consumer>
    );
  };

  /**
   * Evaluate the <doc> element and render the appropriate component
   */
  Route = (props: {
    handleBack?: ComponentType<{ children: ReactNode }>;
  }): React.ReactElement => {
    const renderElement: TypesLegacy.Element | null = this.getRenderElement();

    if (!renderElement) {
      throw new NavigatorService.HvRenderError('No element found');
    }

    if (renderElement.namespaceURI !== Namespaces.HYPERVIEW) {
      throw new NavigatorService.HvRenderError('Invalid namespace');
    }

    if (renderElement.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR) {
      return <HvNavigator element={renderElement} routeComponent={HvRoute} />;
    }
    const { Screen } = this;

    if (renderElement.localName === TypesLegacy.LOCAL_NAME.SCREEN) {
      if (props.handleBack) {
        return (
          <props.handleBack>
            <Screen />
          </props.handleBack>
        );
      }
      return <Screen />;
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

    const { Route } = this;
    return <Route handleBack={this.props.handleBack} />;
  };

  render() {
    const { Error, Load, Content } = this;
    try {
      if (this.state.error) {
        return <Error error={this.state.error} />;
      }
      if (this.props.element || this.state.doc) {
        return <Content />;
      }
      return <Load />;
    } catch (err) {
      if (this.props.onError) {
        this.props.onError(err as Error);
      }
      return <Error error={err} />;
    }
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
  const navigatorMapContext: Types.NavigatorMapContextProps | null = useContext(
    NavigatorMapContext.NavigatorMapContext,
  );
  if (!navigationContext || !navigatorMapContext) {
    throw new NavigatorService.HvRouteError('No context found');
  }

  // Retrieve the url from params or from the context
  let url: string | undefined = props.route?.params?.url;
  // Fragment urls are used to designate a route within a document
  if (url && NavigatorService.isUrlFragment(url)) {
    // Look up the url from the route map where it would have been
    //  stored from the initial <nav-route> definition
    url = navigatorMapContext.getRoute(NavigatorService.cleanHrefFragment(url));
  }

  const id: string | undefined =
    props.route?.params?.id ||
    navigatorMapContext.initialRouteName ||
    undefined;

  if (!url) {
    // Use the route id or initial routeto look up the url
    if (id) {
      url = navigatorMapContext.getRoute(id);
    }
  }

  // Fall back to the entrypoint url, only for the top route
  if (!url && !props.navigation) {
    url = navigationContext.entrypointUrl;
  } else {
    url = url || '';
  }

  const { index, type } = props.navigation?.getState() || {};
  // The nested element is only used when the navigator is not a stack
  //    or is the first screen in a stack. Other stack screens will require a url
  const includeElement: boolean =
    type !== NavigatorService.NAVIGATOR_TYPE.STACK || index === 0;

  // Get the navigator element from the context
  const element: TypesLegacy.Element | undefined =
    id && includeElement ? navigatorMapContext.getElement(id) : undefined;

  return (
    <HvRouteInner
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...{ ...props, ...navigationContext, ...navigatorMapContext }}
      element={element}
      url={url}
    />
  );
}

export type { Props } from './types';
