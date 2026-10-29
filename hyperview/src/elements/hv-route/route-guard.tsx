import * as Types from './types';
import { useCallback, useEffect, useRef } from 'react';
import {
  useFocusEffect,
  useIsFocused,
  usePreventRemove,
} from '@react-navigation/native';

const useRouteFocus = (onFocus: () => void, onBlur: () => void) => {
  const onBlurRef = useRef(onBlur);
  const onFocusRef = useRef(onFocus);
  useEffect(() => {
    onBlurRef.current = onBlur;
    onFocusRef.current = onFocus;
  }, [onBlur, onFocus]);
  useFocusEffect(
    useCallback(() => {
      onFocusRef.current();
      return () => onBlurRef.current();
    }, []),
  );
};

export const RouteGuard = (props: Types.RouteGuardProps) => {
  const {
    children,
    navigation,
    onBlur,
    onFocus,
    onRemove,
    preventRemove,
    resumeRemoval,
    runBackBehaviors,
  } = props;
  const isFocused = useIsFocused();
  const runningBackBehaviors = useRef(false);
  usePreventRemove(isFocused && preventRemove, event => {
    if (runningBackBehaviors.current) {
      resumeRemoval(event.data.action);
      return;
    }

    runningBackBehaviors.current = true;
    try {
      runBackBehaviors();
    } finally {
      runningBackBehaviors.current = false;
    }
  });
  useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!event.defaultPrevented) {
          onRemove();
        }
      }),
    [navigation, onRemove],
  );
  useRouteFocus(onFocus, onBlur);
  return children;
};
