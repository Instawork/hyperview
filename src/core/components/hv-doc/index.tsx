import * as DomService from 'hyperview/src/services/dom';
import * as Helpers from 'hyperview/src/services/dom/helpers';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as UrlService from 'hyperview/src/services/url';
import {
  DOMString,
  HvComponentOptions,
  LOCAL_NAME,
  NavigationRouteParams,
  OnUpdateCallbacks,
  ScreenState,
} from 'hyperview/src/types';
import { ErrorProps, Props } from './types';
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HvDocError } from './errors';
import LoadError from 'hyperview/src/core/components/load-error';
import { StateContext } from './context';
import { later } from 'hyperview/src/services';

const HvDoc = (props: Props) => {
  // <HACK>
  // In addition to storing the document on the react state, we keep a reference to it.
  // When performing batched updates on the DOM, we need to ensure every
  // update occurence operates on the latest DOM version. We cannot rely on `state` right after
  // setting it with `setState`, because React does not guarantee the new state to be immediately
  // available (see details here: https://reactjs.org/docs/react-component.html#setstate)
  // Whenever we need to access the document for reasons other than rendering, we should use
  // `localDoc`. When rendering, we should use `document`.
  const localDoc = useRef<Document | null | undefined>(null);

  // This is a temporary solution to ensure the url is available immediately while
  // external components are still triggering the loadUrl callback
  const localUrl = useRef<string | null | undefined>(null);
  // </HACK>

  const [state, setState] = useState<ScreenState>(() => {
    // Initial state may receive a doc from the props
    if (props.doc) {
      localDoc.current = props.doc;
      return {
        doc: props.doc,
        error: undefined,
        staleHeaderType: undefined,
        styles: props.doc
          ? Stylesheets.createStylesheets(props.doc)
          : undefined,
      };
    }
    return {
      doc: undefined,
      error: undefined,
    };
  });

  const navigationContext: NavigationContext.NavigationContextProps | null = useContext(
    NavigationContext.Context,
  );

  if (!navigationContext) {
    throw new HvDocError('No context found');
  }

  const parser: DomService.Parser = useMemo(
    () =>
      new DomService.Parser(
        navigationContext.fetch,
        navigationContext.onParseBefore ?? null,
        navigationContext.onParseAfter ?? null,
      ),
    [
      navigationContext.fetch,
      navigationContext.onParseBefore,
      navigationContext.onParseAfter,
    ],
  );

  const loadUrl = useCallback(
    async (url?: string) => {
      // Updates the state and calls the error handler
      const handleError = (err: Error, u?: string | null) => {
        try {
          if (navigationContext.onError) {
            navigationContext.onError(err);
          }
        } finally {
          setState(prev => ({
            ...prev,
            error: err,
            url: u ?? prev.url,
          }));
        }
      };

      const targetUrl = url ?? state.url;
      if (!targetUrl) {
        handleError(new HvDocError('No URL provided'), targetUrl);
        return;
      }

      try {
        if (props.route?.params.delay) {
          const delay =
            typeof props.route.params.delay === 'number'
              ? props.route.params.delay
              : parseInt(props.route.params.delay, 10);
          await later(delay);
        }

        const fullUrl = UrlService.getUrlFromHref(
          targetUrl,
          navigationContext.entrypointUrl,
        );
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
            error: undefined,
            staleHeaderType,
            styles: stylesheets,
            url: targetUrl,
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
      }
    },
    [navigationContext, parser, props.route?.params.delay, state.url],
  );

  const needsLoadCallback = useRef(() => {
    // Noop
  });
  const getScreenState = useCallback(
    () => ({ ...state, url: localUrl.current }),
    [state],
  );
  const getDoc = useCallback(() => localDoc.current ?? null, [localDoc]);
  const getNavigation = useCallback(() => props.navigationProvider, [
    props.navigationProvider,
  ]);
  const hasElement = !!props.element;
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
        doc: hasElement ? null : newState.doc ?? prev.doc,
      }));
    },
    [hasElement],
  );

  const onUpdateCallbacksRef = useRef<OnUpdateCallbacks>();

  const onUpdate = useCallback(
    (
      href: DOMString | null | undefined,
      action: DOMString | null | undefined,
      element: Element,
      options: HvComponentOptions,
    ) => {
      navigationContext.onUpdate(href, action, element, {
        ...options,
        onUpdateCallbacks: onUpdateCallbacksRef.current,
      });
    },
    [navigationContext],
  );

  const reload = useCallback(
    (url?: string | null) => {
      navigationContext.reload(url, {
        onUpdateCallbacks: onUpdateCallbacksRef.current,
      });
    },
    [navigationContext],
  );

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
      getOnUpdate: () => onUpdate,
      getState: getScreenState,
      setNeedsLoad: needsLoadCallback.current,
      setState: setScreenState,
    };

    return {
      getLocalDoc: getDoc,
      getScreenState,
      loadUrl,
      onUpdate,
      onUpdateCallbacks: onUpdateCallbacksRef.current,
      reload,
      setNeedsLoadCallback: (callback: () => void) => {
        needsLoadCallback.current = callback;
      },
      setScreenState,
    };
  }, [
    getDoc,
    getNavigation,
    getScreenState,
    loadUrl,
    onUpdate,
    reload,
    setScreenState,
    state.elementError,
  ]);

  /**
   * View shown when there is an error
   */
  const Err = (p: ErrorProps): React.ReactElement => {
    const { error, navigationProvider, url } = p;
    const ErrorScreen = navigationContext.errorScreen || LoadError;
    return (
      <ErrorScreen
        back={() => navigationProvider?.backAction({} as NavigationRouteParams)}
        error={error}
        onPressReload={() => contextValue.reload(url)}
        onPressViewDetails={(u: string | undefined) => {
          if (u) {
            navigationProvider?.openModalAction({
              url: u,
            } as NavigationRouteParams);
          }
        }}
      />
    );
  };

  return (
    <StateContext.Provider value={contextValue}>
      {state.error ? (
        //  Render the state error
        <Err
          error={state.error}
          navigationProvider={props.navigationProvider}
          url={state.url ?? props.route?.params.url}
        />
      ) : (
        props.children
      )}
    </StateContext.Provider>
  );
};

export default HvDoc;
export { StateContext };
