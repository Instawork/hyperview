import { ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';
import { LoadingProps } from './types';
import styles from './styles';
import { useElementCache } from 'hyperview/src/contexts/element-cache';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

/**
 * Renders a loading screen
 * Uses either the passed loading screen or a default
 * Injects the behavior element if it exists
 * Performs cleanup when the component is unmounted
 */
const Loading = (props: LoadingProps): React.ReactElement => {
  const { loadingScreen } = useHyperview();
  const { getElement, removeElement } = useElementCache();

  // Perform cleanup when the component is unmounted
  useEffect(() => {
    return () => {
      if (props.cachedId) {
        removeElement(props.cachedId);
      }
    };
  }, [props.cachedId, removeElement]);

  // Use the passed preloadScreen component
  if (props.preloadScreenComponent) {
    return <>{props.preloadScreenComponent}</>;
  }

  // Fall back to default loading screen if the contexts are not available

  if (!loadingScreen) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  // The behavior element which triggered the load
  const behaviorElement = props.cachedId
    ? getElement(props.cachedId)
    : undefined;

  // If the behavior element is not found, look for a route element
  const element =
    behaviorElement !== undefined ? behaviorElement : props.routeElement?.();

  // Instantiate the loading screen with the triggering element
  return React.createElement(loadingScreen, {
    element,
  });
};

export default Loading;
