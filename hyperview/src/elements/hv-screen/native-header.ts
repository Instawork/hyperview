import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  NativeHeaderInitializerProps,
  NativeHeaderNavigation,
} from './types';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { HvComponentOnUpdate } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

/**
 * Resolves native header options before the screen body is rendered.
 */
export const useNativeHeader = (
  body: Element | undefined,
  onUpdate: HvComponentOnUpdate,
) => {
  const { navigationComponents } = useHyperview();
  const [isInitialized, setIsInitialized] = useState(false);
  const onPress = useCallback(
    (element: Element) => Behaviors.triggerPressBehaviors(element, onUpdate),
    [onUpdate],
  );
  const options = useMemo(() => {
    const [header] = body
      ? Array.from(
          body.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.HEADER),
        )
      : [];
    return header
      ? navigationComponents?.HeaderView?.getOptions?.(header, onPress)
      : undefined;
  }, [body, navigationComponents, onPress]);
  const onInitialized = useCallback(() => setIsInitialized(true), []);

  return {
    onInitialized,
    options,
    shouldInitializeNativeHeader: Boolean(options && !isInitialized),
  };
};

/**
 * Finds the stack that owns the current route's native header.
 */
const getNativeHeaderNavigation = (
  navigation: NativeHeaderNavigation,
): NativeHeaderNavigation => {
  let current = navigation;
  while (current.getState().type !== 'stack') {
    const parent = current.getParent<NativeHeaderNavigation>();
    if (!parent) {
      return current;
    }
    current = parent;
  }
  return current;
};

/**
 * Initializes native header options before the screen body is rendered.
 */
export const NativeHeaderInitializer = (
  props: NativeHeaderInitializerProps,
) => {
  const navigation = useNavigation<NativeHeaderNavigation>();
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (!isFocused) {
      return;
    }
    getNativeHeaderNavigation(navigation).setOptions(props.options);
    props.onInitialized();
  }, [isFocused, navigation, props]);

  return null;
};
