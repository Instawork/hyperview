import * as Helpers from 'hyperview/src/services/dom/helpers';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Types from './types';
import {
  BackBehaviorProvider,
  useBackBehaviorContext,
} from 'hyperview/src/contexts/back-behaviors';
import HvDoc, {
  HvDocContext,
  useUnsafeHvDocContext,
} from 'hyperview/src/elements/hv-doc';
import type {
  ListenerEvent,
  NavigationProps,
  ScreenState,
} from 'hyperview/src/types';
import React, {
  PureComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  getNestedNavigator,
  getVisibleBackBehaviors,
  registerRouteFocusListener,
} from './helpers';
import HvNavigator from 'hyperview/src/elements/hv-navigator';
import HvScreen from 'hyperview/src/elements/hv-screen';
import { LOCAL_NAME } from 'hyperview/src/types';
import { NavigationContainerRefContext } from '@react-navigation/native';
import { RouteGuard } from './route-guard';
import { useElementCache } from 'hyperview/src/contexts/element-cache';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

/**
 * Implementation of an HvRoute component
 * Performs the following:
 * - Loads the document
 * - Renders the document
 * - Handles errors
 */
class HvRouteInner extends PureComponent<Types.InnerRouteProps, ScreenState> {
  getRenderElement = (): Element | undefined => {
    if (this.props.element) {
      return this.props.element;
    }
    if (!this.props.getDoc()) {
      throw new NavigatorService.HvRenderError('No document found');
    }

    // Get the <doc> element
    const root: Element | null = Helpers.getFirstChildTag(
      this.props.getDoc() as Document,
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
   * Build the <HvScreen> component with injected props
   */
  Screen = (): React.ReactElement => {
    return (
      <HvScreen
        componentRegistry={this.props.componentRegistry}
        elementErrorComponent={this.props.elementErrorComponent}
        getScreenState={this.props.getScreenState}
        onUpdate={this.props.onUpdate}
        onUpdateCallbacks={this.props.onUpdateCallbacks}
        reload={this.props.reload}
        setScreenState={this.props.setScreenState}
      />
    );
  };

  /**
   * Evaluate the <doc> element and render the appropriate component
   */
  Route = (): React.ReactElement => {
    const { Screen } = this;

    const isModalFlow = NavigatorService.isModalFlowRoute(this.props.route);

    const renderElement: Element | undefined = isModalFlow
      ? undefined
      : this.getRenderElement();

    if (!isModalFlow) {
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
        if (!this.props.getDoc()) {
          throw new NavigatorService.HvRouteError('No document received');
        }
      }
    }

    if (isModalFlow || renderElement?.localName === LOCAL_NAME.NAVIGATOR) {
      const routeParams = this.props.route?.params;
      const navigatorParams = isModalFlow
        ? {
            ...routeParams,
            id: routeParams?.id ?? this.props.route?.key,
          }
        : routeParams;
      return (
        <HvNavigator
          element={renderElement}
          isModalFlow={isModalFlow}
          isRootNavigator={this.props.route === undefined}
          onUpdate={this.props.onUpdate}
          params={navigatorParams}
          routeComponent={HvRoute}
        />
      );
    }

    if (renderElement?.localName === LOCAL_NAME.SCREEN) {
      return <Screen />;
    }

    throw new NavigatorService.HvRenderError('Invalid element type');
  };

  render() {
    const { Route } = this;
    return <Route />;
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
function HvRouteFC(props: Types.Props) {
  const {
    componentRegistry,
    elementErrorComponent,
    entrypointUrl,
    onRouteBlur,
    onRouteFocus,
  } = useHyperview();
  const { setElement } = useElementCache();
  const { get, onUpdate } = useBackBehaviorContext();
  const { getDoc, getSourceDoc, setDoc } = useUnsafeHvDocContext() || {};

  const url =
    props.navigation === undefined
      ? entrypointUrl
      : NavigatorService.cleanHrefFragment(
          props.route?.params?.url || entrypointUrl,
        );

  const rootNavigation = useContext(NavigationContainerRefContext);
  const nav =
    props.navigation || ((rootNavigation as unknown) as NavigationProps);
  const navigator = useMemo(
    () =>
      new NavigatorService.Navigator({
        entrypointUrl,
        navigation: nav,
        rootNavigation,
        route: props.route,
        setElement,
      }),
    [entrypointUrl, nav, props.route, rootNavigation, setElement],
  );

  // Get the navigator element from the context
  const element: Element | undefined = getNestedNavigator(
    props.route?.params?.id,
    getSourceDoc?.(),
  );

  const id = props.route?.params?.id || props.route?.key;
  const routeUrl = props.route?.params?.url;

  const handleBlur = useCallback(() => {
    if (onRouteBlur && props.route) {
      onRouteBlur(props.route);
    }
  }, [onRouteBlur, props.route]);

  const handleFocus = useCallback(() => {
    const doc = getDoc?.();
    NavigatorService.setSelected(doc, id, setDoc);
    NavigatorService.addStackRoute(
      doc,
      id,
      props.route,
      nav.getState().routes[0]?.name,
      entrypointUrl,
      setDoc,
    );
  }, [entrypointUrl, getDoc, id, nav, props.route, setDoc]);

  const visibleElements = getVisibleBackBehaviors(get());
  const runBackBehaviors = useCallback(() => {
    const currentVisibleElements = getVisibleBackBehaviors(get());
    if (currentVisibleElements.length > 0 && onUpdate) {
      currentVisibleElements.forEach(behaviorElement => {
        const href = behaviorElement.getAttribute('href');
        const behaviorAction = behaviorElement.getAttribute('action');
        onUpdate(href, behaviorAction, behaviorElement, {
          behaviorElement,
          showIndicatorId: behaviorElement.getAttribute('show-during-load'),
          targetId: behaviorElement.getAttribute('target'),
        });
      });
    }
  }, [get, onUpdate]);

  const resumeRemoval = useCallback(
    (action: Types.PreventRemoveAction) => {
      nav.dispatch(action);
    },
    [nav],
  );

  const handleRemove = useCallback(() => {
    if (getVisibleBackBehaviors(get()).length === 0) {
      NavigatorService.removeStackRoute(
        getDoc?.(),
        routeUrl,
        entrypointUrl,
        setDoc,
      );
    }
  }, [entrypointUrl, get, getDoc, routeUrl, setDoc]);

  const handleState = useCallback(
    (event: ListenerEvent) => {
      NavigatorService.updateRouteUrlFromState(
        getDoc?.(),
        id,
        event.data?.state,
        setDoc,
      );
    },
    [getDoc, id, setDoc],
  );

  // Update the urls in each route when the state updates the params
  useEffect(() => {
    if (!nav) {
      return undefined;
    }
    return nav.addListener('state', handleState);
  }, [nav, handleState]);

  // Preserve the public callback timing without making route state depend on transitions.
  useEffect(() => {
    if (!nav) {
      return undefined;
    }
    return registerRouteFocusListener(nav, props.route, onRouteFocus);
  }, [nav, onRouteFocus, props.route]);

  return (
    <HvDoc
      hasElement={!!element}
      navigationProvider={navigator}
      onUrlChange={navigator.updateRouteUrl}
      route={props.route}
      url={url}
    >
      <HvDocContext>
        {({
          getDoc: localGetDoc,
          getScreenState,
          onUpdate: stateOnUpdate,
          onUpdateCallbacks,
          reload,
          setScreenState,
        }) => {
          const routeContent = (
            <HvRouteInner
              componentRegistry={componentRegistry}
              element={element}
              elementErrorComponent={elementErrorComponent}
              getDoc={localGetDoc}
              getScreenState={getScreenState}
              onUpdate={stateOnUpdate}
              onUpdateCallbacks={onUpdateCallbacks}
              reload={reload}
              route={props.route}
              setScreenState={setScreenState}
              url={url}
            />
          );
          return props.route ? (
            <RouteGuard
              navigation={nav}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onRemove={handleRemove}
              preventRemove={visibleElements.length > 0}
              resumeRemoval={resumeRemoval}
              runBackBehaviors={runBackBehaviors}
            >
              {routeContent}
            </RouteGuard>
          ) : (
            routeContent
          );
        }}
      </HvDocContext>
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
