import * as Components from 'hyperview/src/services/components';
import * as Contexts from 'hyperview/src/contexts';
import * as DomService from 'hyperview/src/services/dom';
import * as Helpers from 'hyperview/src/services/dom/helpers';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as Types from './types';
import * as UrlService from 'hyperview/src/services/url';
import {
  BackBehaviorContext,
  BackBehaviorProvider,
} from 'hyperview/src/contexts/back-behaviors';
import type {
  DOMString,
  HvComponentOptions,
  NavigationRouteParams,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';
import React, { JSXElementConstructor, PureComponent, useContext } from 'react';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import { LOCAL_NAME } from 'hyperview/src/types';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
import { NavigationContainerRefContext } from '@react-navigation/native';

/**
 * Implementation of an HvRoute component
 * Performs the following:
 * - Loads the document
 * - Renders the document
 * - Handles errors
 */
class HvRouteInner extends PureComponent<Types.InnerRouteProps, ScreenState> {
  static contextType = NavigationContainerRefContext;

  context: React.ContextType<typeof NavigationContainerRefContext> = undefined;

  parser?: DomService.Parser;

  navigator: NavigatorService.Navigator;

  componentRegistry: Components.Registry;

  needsLoad = false;

  // See the hack in hv-screen. This is a fix for the updated DOM not being available immediately.
  localDoc: Document | null = null;

  constructor(props: Types.InnerRouteProps) {
    super(props);

    this.state = {
      doc: null,
      error: null,
    };
    this.navigator = new NavigatorService.Navigator(this.props);
    this.componentRegistry = new Components.Registry(this.props.components);
    this.needsLoad = false;
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
    this.navigator.setContext(this.context);

    // When a nested navigator is found, the document is not loaded from url
    if (this.props.element === undefined) {
      this.load();
    }
  }

  componentDidUpdate(prevProps: Types.InnerRouteProps) {
    if (prevProps.url !== this.props.url || this.needsLoad) {
      this.load();
      this.needsLoad = false;
    }
  }

  getUrl = (): string => {
    return UrlService.getUrlFromHref(
      (this.needsLoad ? this.state.url : undefined) ||
        this.props.url ||
        this.props.entrypointUrl,
      this.props.entrypointUrl,
    );
  };

  /**
   * Fix for both route and screen loading the document when url changes
   * The route will not perform a load if a screen has already been rendered
   */
  shouldReload = (): boolean => {
    return (
      !this.localDoc ||
      !(this.getRenderElement()?.localName === LOCAL_NAME.SCREEN)
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
        url: null,
      });
      return;
    }

    try {
      // When a modal is included, a wrapper stack navigator is created
      // The route which contains the navigator should not load the document
      // The code below prevents the route from loading the document
      if (this.props.route?.params?.isModal || !this.shouldReload()) {
        return;
      }

      const url: string = this.getUrl();

      const { doc } = await this.parser.loadDocument(url);

      // Set the state with the merged document

      const merged = NavigatorService.mergeDocument(
        doc,
        this.localDoc || undefined,
      );
      const root = Helpers.getFirstChildTag(merged, LOCAL_NAME.DOC);
      if (!root) {
        this.setState({
          doc: null,
          error: new NavigatorService.HvRouteError('No root element found'),
          url: null,
        });
        return;
      }
      this.localDoc = merged;
      this.setState({
        doc: merged,
        error: undefined,
        url,
      });
    } catch (err: unknown) {
      if (this.props.onError) {
        this.props.onError(err as Error);
      }
      this.setState({
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
    if (!this.localDoc) {
      throw new NavigatorService.HvRenderError('No document found');
    }

    // Get the <doc> element
    const root: Element | null = Helpers.getFirstChildTag(
      this.localDoc,
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
   * Implement the callbacks from this class
   */
  updateCallbacks: OnUpdateCallbacks = {
    clearElementError: () => {
      // Noop
    },
    getDoc: () => this.localDoc || null,
    getNavigation: () => this.navigator,
    getOnUpdate: () => this.onUpdate,
    getState: () => this.state,
    setNeedsLoad: () => {
      this.needsLoad = true;
    },
    setState: (state: ScreenState) => {
      if (state.doc) {
        this.localDoc = state.doc;
      }
      this.setState(state);
    },
  };

  onUpdate = (
    href: DOMString | null | undefined,
    action: DOMString | null | undefined,
    element: Element,
    options: HvComponentOptions,
  ) => {
    this.props.onUpdate(href, action, element, {
      ...options,
      onUpdateCallbacks: this.updateCallbacks,
    });
  };

  /**
   * View shown while loading
   * Includes preload functionality
   */
  Load = (): React.ReactElement => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {};

    if (this.props.route?.params?.preloadScreen) {
      const preloadElement = this.props.getElement(
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
          return (
            <Loading
              cachedId={this.props.route.params.preloadScreen}
              preloadScreenComponent={component}
            />
          );
        }
      }
    }

    return (
      <Loading
        cachedId={this.props.route?.params?.behaviorElementId}
        routeElement={() => {
          return this.props.route?.params?.routeId && this.props.doc
            ? NavigatorService.getRouteById(
                this.props.doc,
                this.props.route.params.routeId,
              )
            : undefined;
        }}
      />
    );
  };

  /**
   * View shown when there is an error
   */
  Error = (props: { error: Error | null | undefined }): React.ReactElement => {
    const ErrorScreen = this.props.errorScreen || LoadError;
    return (
      <ErrorScreen
        back={() => this.navigator.backAction({} as NavigationRouteParams)}
        error={props.error}
        onPressReload={() => this.load()}
        onPressViewDetails={(uri: string | undefined) => {
          this.navigator.openModalAction({
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
            behaviors={this.props.behaviors}
            components={this.props.components}
            doc={this.localDoc?.cloneNode(true) as Document}
            elementErrorComponent={this.props.elementErrorComponent}
            entrypointUrl={this.props.entrypointUrl}
            errorScreen={this.props.errorScreen}
            fetch={this.props.fetch}
            formatDate={formatter}
            getElement={this.props.getElement}
            navigation={this.navigator}
            onError={this.props.onError}
            onParseAfter={this.props.onParseAfter}
            onParseBefore={this.props.onParseBefore}
            onUpdate={this.props.onUpdate}
            reload={this.props.reload}
            removeElement={this.props.removeElement}
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
      if (this.localDoc) {
        // The <DocContext> provides doc access to nested navigators
        // The <UpdateContext> provides access to the onUpdate method for this route
        // only pass it when the doc is available and is not being overridden by an element
        return (
          <Contexts.DocContext.Provider
            value={{
              getDoc: () => this.localDoc || undefined,
              setDoc: (doc: Document) => {
                if (doc != null) {
                  this.localDoc = doc;
                }
                this.setState({ doc });
              },
            }}
          >
            <Contexts.OnUpdateContext.Provider
              value={{
                onUpdate: this.onUpdate,
              }}
            >
              <HvNavigator
                element={renderElement}
                onUpdate={this.onUpdate}
                params={this.props.route?.params}
                routeComponent={HvRoute}
              />
            </Contexts.OnUpdateContext.Provider>
          </Contexts.DocContext.Provider>
        );
      }
      // Without a doc, the navigator shares the higher level context
      return (
        <Contexts.OnUpdateContext.Consumer>
          {updater => (
            <HvNavigator
              element={renderElement}
              onUpdate={updater.onUpdate}
              params={this.props.route?.params}
              routeComponent={HvRoute}
            />
          )}
        </Contexts.OnUpdateContext.Consumer>
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
      if (!this.localDoc) {
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
        this.localDoc ||
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
 * Functional component wrapper around HvRouteInner
 * NOTE: The reason for this approach is to allow accessing
 *  multiple contexts to pass data to HvRouteInner
 * Performs the following:
 * - Retrieves the url from the props, params, or context
 * - Retrieves the navigator element from the context
 * - Passes the props, context, and url to HvRouteInner
 */
function HvRouteFC(props: Types.Props) {
  const navigationContext: Types.NavigationContextProps | null = useContext(
    NavigationContext.Context,
  );
  const elemenCacheContext = useContext(Contexts.ElementCacheContext);
  if (!navigationContext || !elemenCacheContext) {
    throw new NavigatorService.HvRouteError('No context found');
  }
  const backContext = useContext(BackBehaviorContext);
  const docContext = useContext(Contexts.DocContext);

  const url = getRouteUrl(props, navigationContext);
  const rootNavigation = useContext(NavigationContainerRefContext);
  const nav =
    props.navigation || (rootNavigation as NavigatorService.NavigationProp);

  // Get the navigator element from the context
  const element: Element | undefined = getNestedNavigator(
    props.route?.params?.id,
    docContext?.getDoc(),
  );

  React.useEffect(() => {
    const id = props.route?.params?.id || props.route?.key;
    if (nav) {
      const unsubscribeBlur: () => void = nav.addListener('blur', () => {
        if (navigationContext.onRouteBlur && props.route) {
          navigationContext.onRouteBlur(props.route);
        }
      });

      // Use the focus event to set the selected route
      const unsubscribeFocus: () => void = nav.addListener('focus', () => {
        const navStateMutationsDelay =
          navigationContext.experimentalFeatures?.navStateMutationsDelay || 0;
        const updateRouteFocus = () => {
          const doc = docContext?.getDoc();
          NavigatorService.setSelected(doc, id, docContext?.setDoc);
          NavigatorService.addStackRoute(
            doc,
            id,
            props.route,
            nav.getState().routes[0]?.name,
            navigationContext.entrypointUrl,
            docContext?.setDoc,
          );
          if (navigationContext.onRouteFocus && props.route) {
            navigationContext.onRouteFocus(props.route);
          }
        };
        if (navStateMutationsDelay > 0) {
          // The timeout ensures the processing occurs after the screen is rendered or shown
          setTimeout(() => {
            updateRouteFocus();
          }, navStateMutationsDelay);
        } else {
          updateRouteFocus();
        }
      });

      // Use the beforeRemove event to remove the route from the stack
      const unsubscribeRemove: () => void = nav.addListener(
        'beforeRemove',
        (event: { preventDefault: () => void }) => {
          // Use the current document state to access behaviors on the document
          // Check for elements registered to interrupt back action via a trigger of BACK
          const { get, onUpdate } = backContext || {};
          const elements: Element[] = (get && get()) || [];
          if (elements.length > 0 && onUpdate && nav.isFocused()) {
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
            // Perform cleanup of the associated route (retrieved from parent document state)
            NavigatorService.removeStackRoute(
              docContext?.getDoc(),
              props.route?.params?.url,
              navigationContext.entrypointUrl,
              docContext?.setDoc,
            );
          }
        },
      );

      // Update the urls in each route when the state updates the params
      const unsubscribeState: () => void = nav.addListener('state', event => {
        const navStateMutationsDelay =
          navigationContext.experimentalFeatures?.navStateMutationsDelay || 0;
        const updateRouteUrlFromState = (e: NavigatorService.ListenerEvent) => {
          NavigatorService.updateRouteUrlFromState(
            docContext?.getDoc(),
            id,
            e.data?.state,
            docContext?.setDoc,
          );
        };
        if (navStateMutationsDelay > 0) {
          // The timeout ensures the processing occurs after the screen is rendered or shown
          setTimeout(() => {
            updateRouteUrlFromState(event);
          }, navStateMutationsDelay);
        } else {
          updateRouteUrlFromState(event);
        }
      });

      return () => {
        unsubscribeBlur();
        unsubscribeFocus();
        unsubscribeRemove();
        unsubscribeState();
      };
    }
    return undefined;
  }, [nav, props.route, backContext, docContext, navigationContext]);

  return (
    <HvRouteInner
      behaviors={navigationContext.behaviors}
      components={navigationContext.components}
      doc={docContext?.getDoc()}
      element={element}
      elementErrorComponent={navigationContext.elementErrorComponent}
      entrypointUrl={navigationContext.entrypointUrl}
      errorScreen={navigationContext.errorScreen}
      fetch={navigationContext.fetch}
      getElement={elemenCacheContext.getElement}
      handleBack={navigationContext.handleBack}
      navigation={nav}
      onError={navigationContext.onError}
      onParseAfter={navigationContext.onParseAfter}
      onParseBefore={navigationContext.onParseBefore}
      onUpdate={navigationContext.onUpdate}
      reload={navigationContext.reload}
      removeElement={elemenCacheContext.removeElement}
      route={props.route}
      setElement={elemenCacheContext.setElement}
      url={url}
    />
  );
}

export default function HvRoute(props: Types.Props) {
  return (
    <BackBehaviorProvider>
      <HvRouteFC navigation={props.navigation} route={props.route} />
    </BackBehaviorProvider>
  );
}
export type { InnerRouteProps, Props } from './types';
