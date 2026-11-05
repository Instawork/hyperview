import { useCallback, useEffect, useRef } from 'react';
import {
  useFocusEffect,
  useIsFocused,
  usePreventRemove,
} from '@react-navigation/native';
import type { RouteLifecycleProps } from './types';

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
  preventRemove,
  resumeRemoval,
  runBackBehaviors,
}: RouteLifecycleProps) => {
  const isFocused = useIsFocused();
  const runningBackBehaviors = useRef(false);

  useRouteFocus(onFocus, onBlur);
  usePreventRemove(isFocused && preventRemove, event => {
    if (runningBackBehaviors.current) {
      resumeRemoval(event.data.action);
      return;
    }
    runningBackBehaviors.current = true;
    try {
      if (!runBackBehaviors()) {
        resumeRemoval(event.data.action);
      }
    } finally {
      runningBackBehaviors.current = false;
    }
  });

  return children;
};
