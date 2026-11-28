import type { HeaderCallbacks, HeaderViewProps } from 'hyperview';
import {
  getCurrentHeaderMetadata,
  getHeaderOptions,
  resetHeaderOptions,
} from './options';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { HeaderNavigation } from './types';
import type { SearchBarCommands } from 'react-native-screens';
import { getStackHeaderNavigation } from './helpers';
import { isLiquidGlassSupported } from '../../Helpers';

export const HeaderView = ({
  children,
  element,
  getElementById,
  isRouteLoading,
  onChangeText,
  onPress,
  onTrigger,
  renderItem,
}: HeaderViewProps) => {
  const navigation = useNavigation<HeaderNavigation>();
  const headerNavigation = getStackHeaderNavigation(navigation);
  const isFocused = useIsFocused();
  const isFocusedRef = useRef(isFocused);
  isFocusedRef.current = isFocused;
  const suppressLoadingHeader = Boolean(
    isRouteLoading && isLiquidGlassSupported(),
  );
  const callbacks = useMemo(
    () => ({
      getElementById,
      onChangeText,
      onPress,
      onTrigger,
      renderItem,
    }),
    [getElementById, onChangeText, onPress, onTrigger, renderItem],
  );
  const searchBarRef = useRef<SearchBarCommands>(null);
  const nativeSearchTextRef = useRef<string | undefined>(undefined);
  const programmaticSearchTextRef = useRef<string | undefined>(undefined);
  const handleNativeSearchChange = useCallback(
    (elementId: string, value: string) => {
      if (
        nativeSearchTextRef.current === value ||
        programmaticSearchTextRef.current === value
      ) {
        nativeSearchTextRef.current = value;
        programmaticSearchTextRef.current = undefined;
        return;
      }
      nativeSearchTextRef.current = value;
      onChangeText(elementId, value);
    },
    [onChangeText],
  );
  const headerOptions = useMemo(() => {
    if (suppressLoadingHeader) {
      return undefined;
    }
    return getHeaderOptions(element, callbacks, {
      onChangeText: handleNativeSearchChange,
      ref: searchBarRef,
    });
  }, [callbacks, element, handleNativeSearchChange, suppressLoadingHeader]);
  const metadata = useMemo(() => getCurrentHeaderMetadata(element), [element]);
  const searchTargetValue = metadata?.searchTarget
    ? getElementById(metadata.searchTarget)?.getAttribute('value') ?? ''
    : undefined;

  useLayoutEffect(() => {
    if (headerOptions && isFocused) {
      headerNavigation.setOptions(headerOptions);
    }
  }, [isFocused, headerOptions, headerNavigation]);
  useLayoutEffect(() => {
    if (!headerOptions) {
      return undefined;
    }
    return () => {
      if (isFocusedRef.current) {
        headerNavigation.setOptions(resetHeaderOptions);
      }
    };
  }, [headerNavigation, headerOptions]);
  useEffect(() => {
    const searchBar = searchBarRef.current;
    if (
      searchBar &&
      searchTargetValue !== undefined &&
      searchTargetValue !== nativeSearchTextRef.current
    ) {
      nativeSearchTextRef.current = searchTargetValue;
      programmaticSearchTextRef.current = searchTargetValue;
      if (searchTargetValue) {
        searchBar.setText(searchTargetValue);
      } else {
        searchBar.clearText();
      }
    }
  }, [headerOptions, searchTargetValue]);

  return suppressLoadingHeader || headerOptions ? null : children;
};

HeaderView.useOptions = useOptions;

function useOptions(element: Element | undefined, callbacks: HeaderCallbacks) {
  return useMemo(
    () => (element ? getHeaderOptions(element, callbacks) : undefined),
    [callbacks, element],
  );
}
