import * as Contexts from 'hyperview/src/contexts';
import * as NavigationContext from 'hyperview/src/contexts/navigation';
import { ActivityIndicator, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { LoadingProps } from './types';
import { NavigationContextProps } from 'hyperview/src/contexts/navigation';
import styles from './styles';

/**
 * Renders a loading screen
 * Uses either the passed loading screen or a default
 * Injects the behavior element if it exists
 * Performs cleanup when the component is unmounted
 */
const Loading = (props: LoadingProps): React.ReactElement => {
  const navigationContext: NavigationContextProps | null = useContext(
    NavigationContext.Context,
  );
  const elementCacheContext = useContext(Contexts.ElementCacheContext);

  // Perform cleanup when the component is unmounted
  useEffect(() => {
    return () => {
      if (props.cachedId) {
        elementCacheContext?.removeElement(props.cachedId);
      }
    };
  }, [elementCacheContext, props.cachedId]);

  // Use the passed preloadScreen component
  if (props.preloadScreenComponent) {
    return <>{props.preloadScreenComponent}</>;
  }

  // Fall back to default loading screen if the contexts are not available
  if (
    !navigationContext ||
    !elementCacheContext ||
    !navigationContext.loadingScreen
  ) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  // The behavior element which triggered the load
  const behaviorElement = props.cachedId
    ? elementCacheContext?.getElement(props.cachedId)
    : undefined;

  // If the behavior element is not found, look for a route element
  const element =
    behaviorElement !== undefined ? behaviorElement : props.routeElement?.();

  // Instantiate the loading screen with the triggering element
  return React.createElement(navigationContext.loadingScreen, {
    element,
  });
};

export type { Props } from './types';
export default Loading;
