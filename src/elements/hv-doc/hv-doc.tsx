import * as DomService from 'hyperview/src/services/dom';
import * as Helpers from 'hyperview/src/services/dom/helpers';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as UrlService from 'hyperview/src/services/url';
import {
  DOMString,
  HvComponentOptions,
  LOCAL_NAME,
  OnUpdateCallbacks,
  RouteParams,
  ScreenState,
} from 'hyperview/src/types';
import { DocState, ErrorProps, Props } from './types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Context } from './context';
import { HvDocError } from './errors';
import HvElement from 'hyperview/src/core/components/hv-element';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
import { later } from 'hyperview/src/services';
import { useElementCache } from 'hyperview/src/contexts/element-cache';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

export default (props: Props) => {
  // <HACK>
  // In addition to storing the document on the react state, we keep a reference to it.
  // When performing batched updates on the DOM, we need to ensure every
  // update occurence operates on the latest DOM version. We cannot rely on `state` right after
  // setting it with `setState`, because React does not guarantee the new state to be immediately
  // available (see details here: https://reactjs.org/docs/react-component.html#setstate)
  // Whenever we need to access the document for reasons other than rendering, we should use
  // `localDoc`. When rendering, we should use `document`.
  const localDoc = useRef<Document | undefined>(undefined);

  // This is a temporary solution to ensure the url is available immediately while
  // external components are still triggering the loadUrl callback
  const localUrl = useRef<string | null | undefined>(null);
  // </HACK>

  const currentProps = useRef(props);

  const [state, setState] = useState<DocState>({
    doc: undefined,
    elementError: null,
    error: null,
    loadingUrl: null,
    staleHeaderType: null,
    styles: null,
    url: null,
  });

  const {
    componentRegistry,
    entrypointUrl,
    errorScreen,
    fetch,
    onParseBefore,
    onParseAfter,
    onError,
    onUpdate,
    reload,
  } = useHyperview();

  const { getElement, removeElement } = useElementCache();

  const parser: DomService.Parser = useMemo(
    () =>
      new DomService.Parser(fetch, onParseBefore ?? null, onParseAfter ?? null),
    [fetch, onParseBefore, onParseAfter],
  );

  const parentDocState = useContext(Context);

  const loadUrl = useCallback(
    async (url?: string) => {
      // Updates the state and calls the error handler
      const handleError = (err: Error, u?: string | null) => {
        try {
          if (onError) {
            onError(err);
          }
        } finally {
          setState(prev => ({
            ...prev,
            error: err,
            loadingUrl: null,
            url: u ?? prev.url,
          }));
        }
      };

      const targetUrl = url ?? state.url;
      if (!targetUrl) {
        handleError(new HvDocError('No URL provided'), targetUrl);
        return;
      }
      const params = props.route?.params ?? {};

      try {
        if (params.delay) {
          const delay =
            typeof params.delay === 'number'
              ? params.delay
              : parseInt(params.delay, 10);
          await later(delay);
        }

        const fullUrl = UrlService.getUrlFromHref(targetUrl, entrypointUrl);
        const { doc, staleHeaderType } = await parser.loadDocument(fullUrl);

        const root = Helpers.getFirstChildTag(doc, LOCAL_NAME.DOC);
        if (root) {
          const navigatorElement: Element | null = Helpers.getFirstChildTag(
            root,
            LOCAL_NAME.NAVIGATOR,
          );

          // Navigator elements can be merged to allow for partial updates; screens do not
          const document = navigatorElement
            ? NavigatorService.mergeDocument(doc, localDoc.current ?? undefined)
            : doc;

          localDoc.current = document;
          localUrl.current = fullUrl;
          const stylesheets = Stylesheets.createStylesheets(doc);
          setState(prev => ({
            ...prev,
            doc: document,
            error: null,
            loadingUrl: null,
            staleHeaderType,
            styles: stylesheets,
            url: fullUrl,
          }));
        } else {
          // Invalid document
          localDoc.current = undefined;
          handleError(new HvDocError('No root element found'), targetUrl);
        }
      } catch (err: unknown) {
        // Error
        localDoc.current = undefined;
        handleError(err as Error, targetUrl);
      } finally {
        if (params.preloadScreen) {
          removeElement(params.preloadScreen);
        }
        if (params.behaviorElementId) {
          removeElement(params.behaviorElementId);
        }
      }
    },

    [
      entrypointUrl,
      onError,
      parser,
      props.route?.params,
      removeElement,
      state.url,
    ],
  );

  // Monitor url changes
  useEffect(() => {
    if (state.loadingUrl) {
      // Handle force reload
      loadUrl(state.loadingUrl);
    } else if (
      props.url &&
      !state.url &&
      props.url !== state.url &&
      !props.hasElement &&
      !props.route?.params?.needsSubStack
    ) {
      // Handle initial load
      loadUrl(props.url);
    }
  }, [
    loadUrl,
    props.hasElement,
    props.route?.params?.needsSubStack,
    props.url,
    state.url,
    state.loadingUrl,
  ]);

  // Monitor prop changes
  useEffect(() => {
    if (
      props.url &&
      currentProps.current.url &&
      props.url !== currentProps.current.url
    ) {
      loadUrl(props.url);
    }
    currentProps.current = props;
  }, [loadUrl, props]);

  const getScreenState = useCallback(
    () => ({ ...state, url: localUrl.current }),
    [state],
  );
  const getDoc = useCallback(() => localDoc.current ?? undefined, [localDoc]);

  // TODO: HvDoc
  // This is a temporary solution required because each HvRoute creates a new HvDoc context
  // and we need to walk up the tree to find the closest loaded doc
  // Once we move HvDoc to the top of the hierarchy, we can remove this
  const getSourceDoc = useCallback(
    () => localDoc.current ?? parentDocState?.getSourceDoc?.(),
    [localDoc, parentDocState],
  );

  const getNavigation = useCallback(() => props.navigationProvider, [
    props.navigationProvider,
  ]);

  const setScreenState = useCallback(
    (newState: ScreenState) => {
      if (newState.doc !== undefined) {
        localDoc.current = newState.doc;
      }
      if (newState.url !== undefined) {
        localUrl.current = newState.url;
      }
      setState(prev => ({
        ...prev,
        ...newState,
        doc: props.hasElement ? undefined : newState.doc ?? prev.doc,
      }));
    },
    [props.hasElement],
  );

  const setDoc = useCallback(
    (doc: Document) => {
      if (!localDoc.current) {
        // If this doc hasn't loaded content, use the higher level doc state
        parentDocState?.setDoc?.(doc);
      } else {
        setScreenState({ doc });
      }
    },
    [parentDocState, setScreenState],
  );

  const onUpdateCallbacksRef = useRef<OnUpdateCallbacks>();

  const onDocUpdate = useCallback(
    (
      href: DOMString | null | undefined,
      action: DOMString | null | undefined,
      element: Element,
      options: HvComponentOptions,
    ) => {
      onUpdate(href, action, element, {
        ...options,
        onUpdateCallbacks: onUpdateCallbacksRef.current,
      });
    },
    [onUpdate],
  );

  const onDocReload = useCallback(
    (url?: string | null) => {
      reload(url, {
        onUpdateCallbacks: onUpdateCallbacksRef.current,
      });
    },
    [reload],
  );

  const updateUrl = useCallback((url: string) => {
    setState(prev => ({
      ...prev,
      loadingUrl: url,
    }));
  }, []);

  const contextValue = useMemo(() => {
    onUpdateCallbacksRef.current = {
      clearElementError: () => {
        if (state.elementError) {
          setState(prev => ({
            ...prev,
            elementError: null,
          }));
        }
      },
      getDoc,
      getNavigation,
      getOnUpdate: () => onDocUpdate,
      getState: getScreenState,
      setState: setScreenState,
      updateUrl,
    };

    return {
      getDoc,
      getScreenState,
      getSourceDoc,
      onUpdate: onDocUpdate,
      onUpdateCallbacks: onUpdateCallbacksRef.current,
      reload: onDocReload,
      setDoc,
      setScreenState,
    };
  }, [
    getDoc,
    getNavigation,
    getScreenState,
    getSourceDoc,
    onDocUpdate,
    onDocReload,
    setDoc,
    setScreenState,
    state.elementError,
    updateUrl,
  ]);

  const isLoading = useMemo(() => {
    return (
      !!state.loadingUrl ||
      (!state.doc &&
        !props.route?.params?.needsSubStack &&
        !props.hasElement &&
        !state.loadingUrl)
    );
  }, [
    state.doc,
    state.loadingUrl,
    props.hasElement,
    props.route?.params?.needsSubStack,
  ]);

  /**
   * View shown when there is an error
   */
  const Error = useCallback(
    (p: ErrorProps): React.ReactElement => {
      const { error, navigationProvider, url } = p;
      const ErrorScreen = errorScreen || LoadError;
      return (
        <ErrorScreen
          back={() => navigationProvider?.backAction({} as RouteParams)}
          error={error}
          onPressReload={() => contextValue.reload(url)}
          onPressViewDetails={(u: string | undefined) => {
            if (u) {
              navigationProvider?.openModalAction({
                url: u,
              } as RouteParams);
            }
          }}
        />
      );
    },
    [contextValue, errorScreen],
  );

  /**
   * View shown while loading
   * Includes preload functionality
   */
  const Loader = useCallback(() => {
    if (props.route?.params?.preloadScreen) {
      const preloadElement = getElement(props.route?.params?.preloadScreen);
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
        const component = (
          <HvElement
            element={body as Element}
            onUpdate={
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              () => {}
            }
            options={{ componentRegistry }}
            stylesheets={styleSheet}
          />
        );
        if (component) {
          return (
            <Loading
              cachedId={props.route?.params?.preloadScreen}
              preloadScreenComponent={component}
            />
          );
        }
      }
    }

    return (
      <Loading
        cachedId={props.route?.params?.behaviorElementId}
        routeElement={() => {
          const doc = getDoc();
          return props.route?.params?.routeId && doc
            ? NavigatorService.getRouteById(doc, props.route.params.routeId)
            : undefined;
        }}
      />
    );
  }, [
    componentRegistry,
    getDoc,
    getElement,
    props.route?.params?.behaviorElementId,
    props.route?.params?.preloadScreen,
    props.route?.params?.routeId,
  ]);

  const component = useMemo(() => {
    if (state.error) {
      return (
        <Error
          error={state.error}
          navigationProvider={props.navigationProvider}
          url={state.url ?? props.route?.params?.url}
        />
      );
    }
    return isLoading ? <Loader /> : props.children;
  }, [
    Error,
    isLoading,
    Loader,
    props.children,
    props.navigationProvider,
    props.route?.params?.url,
    state.error,
    state.url,
  ]);

  return <Context.Provider value={contextValue}>{component}</Context.Provider>;
};
