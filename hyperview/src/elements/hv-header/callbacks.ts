import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import type {
  HeaderCallbacks,
  HvComponentOnUpdate,
  HvComponentOptions,
  StyleSheets,
} from 'hyperview/src/types';
import {
  getDebounceTime,
  triggerTextFieldBehavior,
  updateTextFieldFocus,
  updateTextFieldValue,
} from 'hyperview/src/elements/hv-text-field';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { DebouncedChange } from './types';
import { LOCAL_NAME } from 'hyperview/src/types';
import debounce from 'lodash/debounce';
import { getAncestorByTagName } from 'hyperview/src/services';

export const resolveUniqueElementById = (
  root: Document | Element | undefined,
  id: string,
) => {
  const elements = root
    ? Array.from(root.getElementsByTagName('*')).filter(
        element => element.getAttribute('id') === id,
      )
    : [];
  if (elements.length === 0) {
    Logging.warn(`Unable to resolve native header element with id "${id}"`);
  } else if (elements.length > 1) {
    Logging.warn(
      `Unable to resolve duplicate native header elements with id "${id}"`,
    );
  }
  return elements.length === 1 ? elements[0] : undefined;
};

const getBodyIndex = (
  doc: Document | undefined,
  element: Element | undefined,
) => {
  if (!doc || !element) {
    return undefined;
  }
  const body =
    element.localName === LOCAL_NAME.BODY
      ? element
      : getAncestorByTagName(element, LOCAL_NAME.BODY);
  if (!body) {
    return undefined;
  }
  const index = Array.from(
    doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.BODY),
  ).indexOf(body);
  return index < 0 ? undefined : index;
};

const resolveBody = (doc: Document | undefined, index: number | undefined) => {
  if (index === undefined) {
    return undefined;
  }
  return doc?.getElementsByTagNameNS(Namespaces.HYPERVIEW, LOCAL_NAME.BODY)[
    index
  ];
};

export const useHeaderCallbacks = (
  onUpdate: HvComponentOnUpdate,
  stylesheets: StyleSheets,
  options: HvComponentOptions,
  scopeElement?: Element,
): HeaderCallbacks => {
  const debouncedChanges = useRef(new Map<string, DebouncedChange>());
  const resolveDocument = options.onUpdateCallbacks?.getDoc;
  const bodyIndex = getBodyIndex(resolveDocument?.(), scopeElement);
  const resolveById = useCallback(
    (id: string) => {
      const doc = resolveDocument?.();
      return resolveUniqueElementById(resolveBody(doc, bodyIndex) ?? doc, id);
    },
    [bodyIndex, resolveDocument],
  );
  const onChangeText = useCallback(
    (elementId: string, value: string) => {
      const currentElement = resolveById(elementId);
      if (!currentElement) {
        return;
      }
      const delay = getDebounceTime(currentElement);
      updateTextFieldValue(currentElement, value, onUpdate);
      const existing = debouncedChanges.current.get(elementId);
      if (existing?.delay !== delay) {
        existing?.trigger.cancel();
        debouncedChanges.current.delete(elementId);
      }
      let change = debouncedChanges.current.get(elementId);
      if (!change) {
        change = {
          delay,
          trigger: debounce(() => {
            const liveElement = resolveById(elementId);
            if (liveElement) {
              triggerTextFieldBehavior('change', liveElement, onUpdate);
            }
          }, delay),
        };
        debouncedChanges.current.set(elementId, change);
      }
      change.trigger();
    },
    [onUpdate, resolveById],
  );
  const onPress = useCallback(
    (elementId: string) => {
      const currentElement = resolveById(elementId);
      if (currentElement) {
        Behaviors.triggerPressBehaviors(currentElement, onUpdate);
      }
    },
    [onUpdate, resolveById],
  );
  const onTrigger = useCallback<HeaderCallbacks['onTrigger']>(
    (trigger, elementId) => {
      const currentElement = resolveById(elementId);
      if (currentElement) {
        if (trigger === 'focus' || trigger === 'blur') {
          updateTextFieldFocus(currentElement, trigger === 'focus', onUpdate);
        } else {
          triggerTextFieldBehavior(trigger, currentElement, onUpdate);
        }
      }
    },
    [onUpdate, resolveById],
  );
  const renderItem = useCallback<HeaderCallbacks['renderItem']>(
    (element: Element) =>
      Render.renderElement(element, stylesheets, onUpdate, options),
    [onUpdate, options, stylesheets],
  );

  useEffect(() => {
    const changes = debouncedChanges.current;
    return () => {
      changes.forEach(change => change.trigger.cancel());
      changes.clear();
    };
  }, []);

  return useMemo(
    () => ({
      getElementById: resolveById,
      onChangeText,
      onPress,
      onTrigger,
      renderItem,
    }),
    [onChangeText, onPress, onTrigger, renderItem, resolveById],
  );
};
