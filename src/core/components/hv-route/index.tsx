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
import * as UrlService from 'hyperview/src/services/url';
import type {
  ComponentRegistry,
  DOMString,
  HvComponentOptions,
  NavigationRouteParams,
  ScreenState,
} from 'hyperview/src/types';
import React, {
  JSXElementConstructor,
  PureComponent,
  useCallback,
  useContext,
} from 'react';
import HvDoc from 'hyperview/src/core/components/hv-doc';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import { LOCAL_NAME } from 'hyperview/src/types';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
// eslint-disable-next-line instawork/import-services
import Navigation from 'hyperview/src/services/navigation';

/**
 * Implementation of an HvRoute component
 * Performs the following:
 * - Loads the document
 * - Renders the document
 * - Handles errors
 */
class HvRouteInner extends PureComponent<Types.InnerRouteProps> {
  static contextType = Contexts.DocContext;

  parser?: DomService.Parser;

  componentRegistry: ComponentRegistry;

  constructor(props: Types.InnerRouteProps) {
    super(props);

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
    if (
      prevProps.url !== this.props.url ||
      this.props.needsLoad?.current === true
    ) {
      this.load();
    }
    if (this.props.needsLoad) {
      this.props.needsLoad.current = false;
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
      this.context.setState({
        doc: null,
        error: new NavigatorService.HvRouteError('No parser or context found'),
        url: null,
      });
      return;
    }

    try {
      // When a modal is included, a wrapper stack navigator is created
      // The route which contains the navigator should not load the document
      // The code below prevents the route from loading the document
      if (this.props.route?.params?.isModal) {
        return;
      }

      const url: string = this.getUrl();

      const { doc } = await this.parser.loadDocument(url);

      // Set the state with the merged document
      this.context.setState((prevState: ScreenState) => {
        const merged = NavigatorService.mergeDocument(
          doc,
          prevState.doc || undefined,
        );
        const root = Helpers.getFirstChildTag(merged, LOCAL_NAME.DOC);
        if (!root) {
          return {
            doc: null,
            error: new NavigatorService.HvRouteError('No root element found'),
            url: null,
          };
        }
        return {
          doc: merged,
          error: undefined,
          url,
        };
      });
    } catch (err: unknown) {
      if (this.props.onError) {
        this.props.onError(err as Error);
      }
      this.context.setState({
        doc: null,
        error: err as Error,
        url: null,
      });
    }
  };

  getRenderElement = (): Element | undefined => {
    if (this.props.element) {
      return this.props.element;
    }
    if (!this.context.getState().doc) {
      throw new NavigatorService.HvRenderError('No document found');
    }

    // Get the <doc> element
    const root: Element | null = Helpers.getFirstChildTag(
      this.context.getState().doc,
      LOCAL_NAME.DOC,
    );
    if (!root) {
      throw new NavigatorService.HvRenderError('No root element found');
    }

    // Get the first child as <screen> or <navigator>
    const screenElement: Element | null = Helpers.getFirstChildTag(
      root,
      LOCAL_NAME.SCREEN,
    );
    if (screenElement) {
      return screenElement;
    }

    const navigatorElement: Element | null = Helpers.getFirstChildTag(
      root,
      LOCAL_NAME.NAVIGATOR,
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
        back={() =>
          this.props.navigator?.current.back({} as NavigationRouteParams)
        }
        error={props.error}
        onPressReload={() => this.load()}
        onPressViewDetails={(uri: string | undefined) => {
          this.props.navigator?.current.openModal({
            url: uri as string,
          } as NavigationRouteParams);
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
            back={this.props.navigator?.current.back}
            behaviors={this.props.behaviors}
            closeModal={this.props.navigator?.current.closeModal}
            components={this.props.components}
            elementErrorComponent={this.props.elementErrorComponent}
            entrypointUrl={this.props.entrypointUrl}
            errorScreen={this.props.errorScreen}
            fetch={this.props.fetch}
            formatDate={formatter}
            loadingScreen={this.props.loadingScreen}
            navigate={this.props.navigator?.current.navigate}
            navigation={this.props.navigation}
            onError={this.props.onError}
            onParseAfter={this.props.onParseAfter}
            onParseBefore={this.props.onParseBefore}
            onUpdate={this.props.onUpdate}
            openModal={this.props.navigator?.current.openModal}
            push={this.props.navigator?.current.push}
            registerPreload={this.props.setPreload}
            reload={this.props.reload}
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

    if (isModal || renderElement?.localName === LOCAL_NAME.NAVIGATOR) {
      return (
        <HvNavigator
          element={renderElement}
          onUpdate={this.props.onUpdate}
          params={this.props.route?.params}
          routeComponent={HvRoute}
        />
      );
    }

    if (renderElement?.localName === LOCAL_NAME.SCREEN) {
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
      if (!this.context.getState().doc) {
        throw new NavigatorService.HvRouteError('No document received');
      }
    }

    const { Route } = this;
    return <Route />;
  };

  render() {
    const { Error: Err, Load, Content } = this;
    try {
      if (this.context.getState().error) {
        return <Err error={this.context.getState().error} />;
      }
      if (
        this.props.element ||
        this.context.getState().doc ||
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
    return Helpers.getFirstChildTag(route, LOCAL_NAME.NAVIGATOR) || undefined;
  }
  return undefined;
};

/**
 * Processes the route lifecycle events
 * Requires access to the contexts passed by the HvRoute component
 */
function RouteFC(props: Types.FCProps) {
  // eslint-disable-next-line react/destructuring-assignment
  const { entrypointUrl, route, navigation, onRouteBlur, onRouteFocus } = props;

  // This is the context provided by either this route or a parent component
  const docContext = useContext(Contexts.DocContext);

  // These are provided as a ref instead of a state to avoid re-rendering
  const needsLoad = React.useRef<boolean>(false);
  const navigator = React.useRef<NavigatorService.Navigator>(
    new NavigatorService.Navigator(props),
  );
  const navigationService = React.useRef<Navigation>(
    new Navigation(props.entrypointUrl, {
      back: navigator.current.back,
      closeModal: navigator.current.closeModal,
      navigate: navigator.current.navigate,
      openModal: navigator.current.openModal,
      push: navigator.current.push,
    }),
  );

  const onUpdate = useCallback(
    (
      href: DOMString | null | undefined,
      action: DOMString | null | undefined,
      element: Element,
      options: HvComponentOptions,
    ) => {
      props.onUpdate(href, action, element, {
        ...options,
        onUpdateCallbacks: {
          clearElementError: () => {
            // Noop
          },
          getDoc: () => docContext.getState().doc || null,
          getNavigation: () => navigationService.current,
          getOnUpdate: () => onUpdate,
          getState: () => docContext.getState(),
          registerPreload: (id: number, el: Element) =>
            props.setPreload(id, el),
          setNeedsLoad: () => {
            needsLoad.current = true;
          },
          setState: (state: ScreenState) => {
            docContext.setState(state);
          },
        },
      });
    },
    [props, docContext],
  );

  React.useEffect(() => {
    if (navigation) {
      const unsubscribeBlur: () => void = navigation.addListener('blur', () => {
        if (onRouteBlur && route) {
          onRouteBlur(route);
        }
      });

      // Use the focus event to set the selected route
      const unsubscribeFocus: () => void = navigation.addListener(
        'focus',
        () => {
          const doc = docContext.getState().doc || undefined;
          const id = route?.params?.id || route?.key;
          NavigatorService.setSelected(doc, id);
          NavigatorService.addStackRoute(
            doc,
            id,
            route,
            navigation?.getState().routes[0]?.name,
            entrypointUrl,
          );
          if (onRouteFocus && route) {
            onRouteFocus(route);
          }
        },
      );

      // Use the beforeRemove event to remove the route from the stack
      const unsubscribeRemove: () => void = navigation.addListener(
        'beforeRemove',
        (event: { preventDefault: () => void }) => {
          // Check for elements registered to interupt back action via a trigger of BACK
          const elements: Element[] = docContext.backBehaviorElements.get();
          if (elements.length > 0) {
            // Process the elements
            event.preventDefault();
            elements.forEach(behaviorElement => {
              const href = behaviorElement.getAttribute('href');
              const action = behaviorElement.getAttribute('action');
              onUpdate(href, action, behaviorElement, {
                behaviorElement,
                showIndicatorId: behaviorElement.getAttribute(
                  'show-during-load',
                ),
                targetId: behaviorElement.getAttribute('target'),
              });
            });
          } else {
            // Perform cleanup
            NavigatorService.removeStackRoute(
              docContext.getState().doc || undefined,
              route?.params?.url,
              entrypointUrl,
            );
          }
        },
      );

      return () => {
        unsubscribeBlur();
        unsubscribeFocus();
        unsubscribeRemove();
      };
    }
    return undefined;
  }, [
    docContext,
    entrypointUrl,
    route,
    navigation,
    onRouteBlur,
    onRouteFocus,
    onUpdate,
  ]);

  return (
    <HvRouteInner
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...{ ...props, navigationService, navigator, needsLoad, onUpdate }}
    />
  );
}

/**
 * Functional component wrapper around HvRouteInner
 * NOTE: The reason for this approach is to allow accessing
 *  multiple contexts to pass data to HvRouteInner
 * Performs the following:
 * - Retrieves the url from the props, params, or context
 * - Retrieves the navigator element from the context
 * - Passes the props, contexts, and url to HvRouteComponent
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
  // This is the context provided by a parent component
  const docContext = useContext(Contexts.DocContext);

  // Get the navigator element from the context or the parent context
  const element: Element | undefined = getNestedNavigator(
    props.route?.params?.id,
    docContext?.getState().doc || undefined,
  );
  const url = getRouteUrl(props, navigationContext);

  const Component = (
    <RouteFC
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...{
        ...props,
        ...navigationContext,
        ...navigatorMapContext,
        ...docContext,
        element,
        url,
      }}
    />
  );

  // When an element is present, or the route is being processed as a modal
  // this route is not a document owner and does not need a state context or element registry
  const needsContext = element === undefined && !props.route?.params?.isModal;
  return needsContext ? <HvDoc>{Component}</HvDoc> : Component;
}

export type { Props } from './types';
