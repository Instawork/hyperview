import * as NavigationContext from 'hyperview/src/contexts/navigation';
import * as NavigatorMapContext from 'hyperview/src/contexts/navigator-map';
import React, { useContext, useEffect } from 'react';
import DefaultLoading from './default';
import { NavigationContextProps } from 'hyperview/src/contexts/navigation';
import { NavigatorMapContextProps } from 'hyperview/src/contexts/navigator-map';
import { Props } from './types';

/**
 * Renders a loading screen
 * Uses either the passed loading screen or a default
 * Injects the behavior element if it exists
 * Performs cleanup when the component is unmounted
 */
const Loading = (props: Props): React.ReactElement => {
  const navigationContext: NavigationContextProps | null = useContext(
    NavigationContext.Context,
  );
  const navigatorMapContext: NavigatorMapContextProps | null = useContext(
    NavigatorMapContext.NavigatorMapContext,
  );

  // Perform cleanup when the component is unmounted
  useEffect(() => {
    return () => {
      if (props.behaviorElementId) {
        navigatorMapContext?.removePreload(props.behaviorElementId);
      }
    };
  }, [props.behaviorElementId, navigatorMapContext]);

  // Fall back to default loading screen if the contexts are not available
  if (!navigationContext || !navigatorMapContext) {
    return <DefaultLoading />;
  }

  // When a loading screen has been passed in to Hyperview, use it
  if (navigationContext.loadingScreen) {
    // The behavior element which triggered the load
    const behaviorElement = props.behaviorElementId
      ? navigatorMapContext?.getPreload(props.behaviorElementId)
      : undefined;

    // If the behavior element is not found, use the fallback element
    // which may be a route
    const element =
      behaviorElement !== undefined
        ? behaviorElement
        : props.fallbackElement?.();

    // Instantiate the loading screen with the triggering element
    return React.createElement(navigationContext.loadingScreen, {
      element,
    });
  }

  // Fall back to the default loader
  return <DefaultLoading />;
};

export default Loading;
