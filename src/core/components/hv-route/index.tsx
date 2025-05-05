import * as Components from 'hyperview/src/services/components';
import * as Contexts from 'hyperview/src/contexts';
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
import HvDoc, { StateContext } from 'hyperview/src/core/components/hv-doc';
import React, {
  JSXElementConstructor,
  PureComponent,
  useContext,
  useMemo,
} from 'react';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import { LOCAL_NAME } from 'hyperview/src/types';
import Loading from 'hyperview/src/core/components/loading';
import { NavigationContainerRefContext } from '@react-navigation/native';
import type { ScreenState } from 'hyperview/src/types';

/**
 * Implementation of an HvRoute component
 * Performs the following:
 * - Loads the document
 * - Renders the document
 * - Handles errors
 */
class HvRouteInner extends PureComponent<Types.InnerRouteProps, ScreenState> {
  componentRegistry: Components.Registry;

  needsLoad = false;

  constructor(props: Types.InnerRouteProps) {
    super(props);
    this.componentRegistry = new Components.Registry(this.props.components);
    this.needsLoad = false;
    this.props.setNeedsLoadCallback(() => {
      this.needsLoad = true;
    });
  }

  componentDidMount() {
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
      (this.needsLoad ? this.props.getScreenState().url : undefined) ||
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
      !this.props.getLocalDoc() ||
      !(this.getRenderElement()?.localName === LOCAL_NAME.SCREEN)
    );
  };

  /**
   * Load the url and resolve the xml.
   */
  load = async (): Promise<void> => {
    // When a modal is included, a wrapper stack navigator is created
    // The route which contains the navigator should not load the document
    // The code below prevents the route from loading the document
    if (this.props.route?.params?.needsSubStack || !this.shouldReload()) {
      return;
    }

    const url: string = this.getUrl();
    this.props.loadUrl(url);
  };

  getRenderElement = (): Element | undefined => {
    if (this.props.element) {
      return this.props.element;
    }
    if (!this.props.getLocalDoc()) {
      throw new NavigatorService.HvRenderError('No document found');
    }

    // Get the <doc> element
    const root: Element | null = Helpers.getFirstChildTag(
      this.props.getLocalDoc() as Document,
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

    const propsLocalDoc = this.props.getLocalDoc();
    const localDoc = useMemo(() => {
      return propsLocalDoc?.cloneNode(true) as Document;
    }, [propsLocalDoc]);

    return (
      <HvDoc
        doc={localDoc}
        navigationProvider={this.props.navigator}
        route={route}
      >
        <StateContext.Consumer>
          {({
            getLocalDoc,
            getScreenState,
            loadUrl,
            onUpdate,
            onUpdateCallbacks,
            reload,
            setNeedsLoadCallback,
            setScreenState,
          }) => (
            <Contexts.DateFormatContext.Consumer>
              {formatter => (
                <HvScreen
                  behaviors={this.props.behaviors}
                  components={this.props.components}
                  elementErrorComponent={this.props.elementErrorComponent}
                  entrypointUrl={this.props.entrypointUrl}
                  formatDate={formatter}
                  getElement={this.props.getElement}
                  getLocalDoc={getLocalDoc}
                  getScreenState={getScreenState}
                  loadUrl={loadUrl}
                  navigation={this.props.navigator}
                  onUpdate={onUpdate}
                  onUpdateCallbacks={onUpdateCallbacks}
                  reload={reload}
                  removeElement={this.props.removeElement}
                  route={route}
                  setNeedsLoadCallback={setNeedsLoadCallback}
                  setScreenState={setScreenState}
                />
              )}
            </Contexts.DateFormatContext.Consumer>
          )}
        </StateContext.Consumer>
      </HvDoc>
    );
  };

  /**
   * Evaluate the <doc> element and render the appropriate component
   */
  Route = (): React.ReactElement => {
    const { Screen } = this;

    const needsSubStack = this.props.route?.params.needsSubStack
      ? this.props.route.params.needsSubStack
      : false;

    const renderElement: Element | undefined = needsSubStack
      ? undefined
      : this.getRenderElement();

    if (!needsSubStack) {
      if (!renderElement) {
        throw new NavigatorService.HvRenderError('No element found');
      }

      if (renderElement.namespaceURI !== Namespaces.HYPERVIEW) {
        throw new NavigatorService.HvRenderError('Invalid namespace');
      }

      if (this.props.element === undefined) {
        if (!this.props.url) {
          throw new NavigatorService.HvRouteError('No url received');
        }
        if (!this.props.getLocalDoc()) {
          throw new NavigatorService.HvRouteError('No document received');
        }
      }
    }

    if (needsSubStack || renderElement?.localName === LOCAL_NAME.NAVIGATOR) {
      if (this.props.getLocalDoc()) {
        // The <DocContext> provides doc access to nested navigators
        // The <UpdateContext> provides access to the onUpdate method for this route
        // only pass it when the doc is available and is not being overridden by an element
        return (
          <Contexts.DocContext.Provider
            value={{
              getDoc: () => this.props.getLocalDoc() || undefined,
              setDoc: (doc: Document) => this.props.setScreenState({ doc }),
            }}
          >
            <Contexts.OnUpdateContext.Provider
              value={{
                onUpdate: this.props.onUpdate,
              }}
            >
              <HvNavigator
                element={renderElement}
                onUpdate={this.props.onUpdate}
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

  render() {
    const { Load, Route } = this;

    if (
      this.props.element ||
      this.props.getLocalDoc() ||
      this.props.route?.params?.needsSubStack
    ) {
      return <Route />;
    }
    return <Load />;
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
  const navigator = useMemo(
    () =>
      new NavigatorService.Navigator({
        entrypointUrl: navigationContext.entrypointUrl,
        navigation: nav,
        rootNavigation,
        route: props.route,
        setElement: elemenCacheContext.setElement,
      }),
    [
      elemenCacheContext.setElement,
      nav,
      navigationContext.entrypointUrl,
      props.route,
      rootNavigation,
    ],
  );

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
    <HvDoc element={element} navigationProvider={navigator}>
      <StateContext.Consumer>
        {({
          getLocalDoc,
          getScreenState,
          loadUrl,
          onUpdate,
          onUpdateCallbacks,
          setNeedsLoadCallback,
          setScreenState,
        }) => (
          <HvRouteInner
            behaviors={navigationContext.behaviors}
            components={navigationContext.components}
            doc={docContext?.getDoc()}
            element={element}
            elementErrorComponent={navigationContext.elementErrorComponent}
            entrypointUrl={navigationContext.entrypointUrl}
            getElement={elemenCacheContext.getElement}
            getLocalDoc={getLocalDoc}
            getScreenState={getScreenState}
            handleBack={navigationContext.handleBack}
            loadUrl={loadUrl}
            navigation={nav}
            navigator={navigator}
            onUpdate={onUpdate}
            onUpdateCallbacks={onUpdateCallbacks}
            removeElement={elemenCacheContext.removeElement}
            route={props.route}
            setElement={elemenCacheContext.setElement}
            setNeedsLoadCallback={setNeedsLoadCallback}
            setScreenState={setScreenState}
            url={url}
          />
        )}
      </StateContext.Consumer>
    </HvDoc>
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
