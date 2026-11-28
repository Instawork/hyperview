import * as Dom from 'hyperview/src/services/dom';
import type {
  NativeHeaderInitializerProps,
  NativeHeaderNavigation,
  ProviderProps,
} from './types';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { HeaderCallbacks } from 'hyperview/src/types';
import { HeaderCallbacksProvider } from './context';
import { LOCAL_NAME } from 'hyperview/src/types';
import { useHeaderCallbacks } from './callbacks';
import { useHyperview } from 'hyperview/src/contexts/hyperview';

const useDefaultOptions = () => undefined;

const useNativeHeader = (
  body: Element | undefined,
  callbacks: HeaderCallbacks,
) => {
  const { navigationComponents } = useHyperview();
  const [isInitialized, setIsInitialized] = useState(false);
  const header = body
    ? Dom.getFirstTag(body, LOCAL_NAME.HEADER) ?? undefined
    : undefined;
  const useHeaderOptions =
    navigationComponents?.HeaderView?.useOptions ?? useDefaultOptions;
  const options = useHeaderOptions(header, callbacks);
  const onInitialized = useCallback(() => setIsInitialized(true), []);

  return {
    onInitialized,
    options,
    shouldInitializeNativeHeader: Boolean(options && !isInitialized),
  };
};

const getNativeHeaderNavigation = (
  navigation: NativeHeaderNavigation,
): NativeHeaderNavigation => {
  if (navigation.getState().type === 'stack') {
    return navigation;
  }
  const parent = navigation.getParent<NativeHeaderNavigation>();
  return parent ? getNativeHeaderNavigation(parent) : navigation;
};

const getInitializerProps = (props: NativeHeaderInitializerProps) => ({
  onInitialized: props.onInitialized,
  options: props.options,
});

const NativeHeaderInitializer = (props: NativeHeaderInitializerProps) => {
  const { onInitialized, options } = getInitializerProps(props);
  const navigation = useNavigation<NativeHeaderNavigation>();
  const isFocused = useIsFocused();
  useLayoutEffect(() => {
    if (!isFocused) {
      return;
    }
    getNativeHeaderNavigation(navigation).setOptions(options);
    onInitialized();
  }, [isFocused, navigation, onInitialized, options]);

  return null;
};

export const HeaderProvider = (props: ProviderProps) => {
  const callbacks = useHeaderCallbacks(
    props.onUpdate,
    props.stylesheets,
    props.options,
    props.element,
  );
  const {
    onInitialized,
    options,
    shouldInitializeNativeHeader,
  } = useNativeHeader(props.element, callbacks);

  if (shouldInitializeNativeHeader && options) {
    return (
      <NativeHeaderInitializer
        onInitialized={onInitialized}
        options={options}
      />
    );
  }

  return (
    <HeaderCallbacksProvider callbacks={callbacks}>
      {props.children(Boolean(options))}
    </HeaderCallbacksProvider>
  );
};
