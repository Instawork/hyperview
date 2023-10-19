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
import * as Helpers from 'hyperview/src/services/dom/helpers';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorMapContext from 'hyperview/src/contexts/navigator-map';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as Types from './types';
import * as TypesLegacy from 'hyperview/src/types';
import * as UrlService from 'hyperview/src/services/url';
import {
  ScreenState,
} from 'hyperview/src/types';
import React, { JSXElementConstructor, PureComponent, useContext } from 'react';
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
class HvRouteInner extends PureComponent<Types.InnerRouteProps, ScreenState> {
  parser?: DomService.Parser;

  navLogic: NavigatorService.Navigator;

  componentRegistry: TypesLegacy.ComponentRegistry;

  constructor(props: Types.InnerRouteProps) {
    super(props);

    this.state = {
      doc: null,
      error: null,
    };
    this.navLogic = new NavigatorService.Navigator(this.props);
    this.componentRegistry = Components.getRegistry(this.props.components);
  }

  /**
   * Override the state to clear the doc when an element is passed
   */
  static getDerivedStateFromProps(
    props: Types.InnerRouteProps,
    state: ScreenState,
  ) {
    if (props.element) {
      return { ...state, doc: null };
    }
    return state;
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
        doc: null,
        error: new NavigatorService.HvRouteError('No parser or context found'),
      });
      return;
    }

    try {
      const url: string = this.getUrl();

      const { doc } = await this.parser.loadDocument(url);

      // Set the state with the merged document
      this.setState(state => {
        const merged = NavigatorService.mergeDocument(
          doc,
          state.doc || undefined,
        );
        const root = Helpers.getFirstChildTag(
          merged,
          TypesLegacy.LOCAL_NAME.DOC,
        );
        if (!root) {
          return {
            doc: null,
            error: new NavigatorService.HvRouteError('No root element found'),
          };
        }
        return {
          doc: merged,
          error: undefined,
        };
      });
    } catch (err: unknown) {
      if (this.props.onError) {
        this.props.onError(err as Error);
      }
      this.setState({
        doc: null,
        error: err as Error,
      });
    }
  };

  getRenderElement = (): Element | undefined => {
    if (this.props.element) {
      return this.props.element;
    }
    if (!this.state.doc) {
      throw new NavigatorService.HvRenderError('No document found');
    }

    // Get the <doc> element
    const root: Element | null = Helpers.getFirstChildTag(
      this.state.doc,
      TypesLegacy.LOCAL_NAME.DOC,
    );
    if (!root) {
      throw new NavigatorService.HvRenderError('No root element found');
    }

    // Get the first child as <screen> or <navigator>
    const screenElement: Element | null = Helpers.getFirstChildTag(
      root,
      TypesLegacy.LOCAL_NAME.SCREEN,
    );
    if (screenElement) {
      return screenElement;
    }

    const navigatorElement: Element | null = Helpers.getFirstChildTag(
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

  registerPreload = (id: number, element: Element): void => {
    this.props.setPreload(id, element);
  };

  /**
   * View shown while loading
   * Includes preload functionality
   */
  Load = (): React.ReactElement => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {};

    if (this.props.route?.params?.preloadScreen) {
      const preloadElement = this.props.getPreload(
        this.props.route?.params?.preloadScreen,
      );
      if (preloadElement) {
        const [body] = Array.from(
          preloadElement.getElementsByTagNameNS(
            Namespaces.HYPERVIEW,
            'body',
          ) as HTMLCollectionOf<Element>,
        );
        const styleSheet = Stylesheets.createStylesheets(
          (preloadElement as unknown) as Document,
        );
        const component:
          | string
          | React.ReactElement<unknown, string | JSXElementConstructor<unknown>>
          | null = Render.renderElement(body, styleSheet, () => noop, {
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
  Error = (props: { error: Error | null | undefined }): React.ReactElement => {
    const ErrorScreen = this.props.errorScreen || LoadError;
    return (
      <ErrorScreen
        back={() => this.navLogic.back({} as TypesLegacy.NavigationRouteParams)}
        error={props.error}
        onPressReload={() => this.load()}
        onPressViewDetails={(uri: string | undefined) => {
          this.navLogic.openModal({
            url: uri as string,
          } as TypesLegacy.NavigationRouteParams);
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
            doc={this.state.doc?.cloneNode(true) as Document}
            elementErrorComponent={this.props.elementErrorComponent}
            entrypointUrl={this.props.entrypointUrl}
            errorScreen={this.props.errorScreen}
            fetch={this.props.fetch}
            formatDate={formatter}
            loadingScreen={this.props.loadingScreen}
            navigate={this.navLogic.navigate}
            navigation={this.props.navigation}
            onError={this.props.onError}
            onParseAfter={this.props.onParseAfter}
            onParseBefore={this.props.onParseBefore}
            onUpdate={this.props.onUpdate}
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
  Route = (): React.ReactElement => {
    const { Screen } = this;

    const isModal = this.props.route?.params.isModal
      ? this.props.route.params.isModal
      : false;

    const renderElement: Element | undefined = isModal
      ? undefined
      : this.getRenderElement();

    if (!isModal) {
      if (!renderElement) {
        throw new NavigatorService.HvRenderError('No element found');
      }

      if (renderElement.namespaceURI !== Namespaces.HYPERVIEW) {
        throw new NavigatorService.HvRenderError('Invalid namespace');
      }
    }

    if (
      isModal ||
      renderElement?.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR
    ) {
      if (this.state.doc) {
        // The <DocContext> provides doc access to nested navigators
        // only pass it when the doc is available and is not being overridden by an element
        return (
          <Contexts.DocContext.Provider
            value={{
              getDoc: () => this.state.doc || undefined,
              setDoc: (doc: Document) => this.setState({ doc }),
            }}
          >
            <HvNavigator
              element={renderElement}
              params={this.props.route?.params}
              routeComponent={HvRoute}
            />
          </Contexts.DocContext.Provider>
        );
      }
      // Without a doc, the navigator shares the higher level context
      return (
        <HvNavigator
          element={renderElement}
          params={this.props.route?.params}
          routeComponent={HvRoute}
        />
      );
    }

    if (renderElement?.localName === TypesLegacy.LOCAL_NAME.SCREEN) {
      if (this.props.handleBack) {
        return (
          <this.props.handleBack>
            <Screen />
          </this.props.handleBack>
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
    if (
      this.props.element === undefined &&
      !this.props.route?.params?.isModal
    ) {
      if (!this.props.url) {
        throw new NavigatorService.HvRouteError('No url received');
      }
      if (!this.state.doc) {
        throw new NavigatorService.HvRouteError('No document received');
      }
    }

    const { Route } = this;
    return <Route />;
  };

  render() {
    const { Error: Err, Load, Content } = this;
    try {
      if (this.state.error) {
        return <Err error={this.state.error} />;
      }
      if (
        this.props.element ||
        this.state.doc ||
        this.props.route?.params?.isModal
      ) {
        return <Content />;
      }
      return <Load />;
    } catch (err) {
      if (this.props.onError) {
        this.props.onError(err as Error);
      }
      return <Err error={err as Error} />;
    }
  }
}

/**
 * Retrieve the url from the props, params, or context
 */
const getRouteUrl = (
  props: Types.Props,
  navigationContext: Types.NavigationContextProps,
) => {
  // The initial hv-route element will use the entrypoint url
  if (props.navigation === undefined) {
    return navigationContext.entrypointUrl;
  }

  return props.route?.params?.url
    ? NavigatorService.cleanHrefFragment(props.route?.params?.url)
    : undefined;
};

/**
 * Retrieve a nested navigator as a child of the nav-route with the given id
 */
const getNestedNavigator = (
  id?: string,
  doc?: Document,
): Element | undefined => {
  if (!id || !doc) {
    return undefined;
  }

  const route = NavigatorService.getRouteById(doc, id);
  if (route) {
    return (
      Helpers.getFirstChildTag(route, TypesLegacy.LOCAL_NAME.NAVIGATOR) ||
      undefined
    );
  }
  return undefined;
};

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

  const docContext = useContext(Contexts.DocContext);

  const url = getRouteUrl(props, navigationContext);

  // Get the navigator element from the context
  const element: Element | undefined = getNestedNavigator(
    props.route?.params?.id,
    docContext?.getDoc(),
  );

  // Use the focus event to set the selected route
  React.useEffect(() => {
    if (props.navigation) {
      const unsubscribeFocus: () => void = props.navigation.addListener(
        'focus',
        () => {
          NavigatorService.setSelected(
            docContext?.getDoc(),
            props.route?.params?.id,
          );
        },
      );

      const unsubscribeRemove: () => void = props.navigation.addListener(
        'beforeRemove',
        () => {
          NavigatorService.removeStackRoute(
            docContext?.getDoc(),
            props.route?.params?.id,
          );
        },
      );

      return () => {
        unsubscribeFocus();
        unsubscribeRemove();
      };
    }
    return undefined;
  }, [props.navigation, props.route?.params?.id, docContext]);

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
