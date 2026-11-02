import * as Types from './types';
import { useCallback, useEffect, useRef } from 'react';
import {
  useFocusEffect,
  useIsFocused,
  usePreventRemove,
} from '@react-navigation/native';

const useRouteBlur = (onBlur: () => void) => {
  const onBlurRef = useRef(onBlur);
  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);
  useFocusEffect(useCallback(() => () => onBlurRef.current(), []));
};

export const RouteGuard = (props: Types.RouteGuardProps) => {
  const {
    children,
    onBlur,
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
  useRouteBlur(onBlur);
  return children;
};
