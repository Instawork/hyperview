import { useCallback, useEffect, useRef } from 'react';
import type { RouteLifecycleProps } from './types';
import { useFocusEffect } from '@react-navigation/native';

const useRouteFocus = (
  onFocus: RouteLifecycleProps['onFocus'],
  onBlur: () => void,
) => {
  const onBlurRef = useRef(onBlur);
  const onFocusRef = useRef(onFocus);
  useEffect(() => {
    onBlurRef.current = onBlur;
    onFocusRef.current = onFocus;
  }, [onBlur, onFocus]);
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onFocusRef.current();
      return () => {
        unsubscribe?.();
        onBlurRef.current();
      };
    }, []),
  );
};

export const RouteLifecycle = ({
  children,
  onBlur,
  onFocus,
}: RouteLifecycleProps) => {
  useRouteFocus(onFocus, onBlur);

  return children;
};
