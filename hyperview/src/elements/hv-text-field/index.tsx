import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import {
  createProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import {
  getDebounceTime,
  getFormattedValue,
  triggerTextFieldBehavior,
  updateTextFieldFocus,
  updateTextFieldValue,
} from './updates';
import type { ElementRef } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import type { KeyboardTypeOptions } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { TextContextType } from './types';
import { TextInput } from 'react-native';
import debounce from 'lodash/debounce';

const HvTextField = (props: HvComponentProps) => {
  const elementRef = useRef<Element>(props.element);
  useEffect(() => {
    elementRef.current = props.element;
  }, [props.element]);

  // Extract known attributes into their own variables
  const autoFocus = props.element.getAttribute('auto-focus') === 'true';
  const debounceTimeMs = getDebounceTime(props.element);
  const defaultValue = props.element.getAttribute('value') || undefined;
  const editable = props.element.getAttribute('editable') !== 'false';
  const keyboardType =
    (props.element.getAttribute('keyboard-type') as KeyboardTypeOptions) ||
    undefined;
  const multiline = props.element.getAttribute('multiline') === 'true';
  const secureTextEntry = props.element.getAttribute('secure-text') === 'true';
  const textContentType =
    (props.element.getAttribute('text-content-type') as TextContextType) ||
    'none';

  // Handlers
  const setFocus = (focused: boolean) => {
    updateTextFieldFocus(props.element, focused, props.onUpdate);
  };

  // Create a memoized, debounced function to trigger the "change" behavior
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  const triggerChangeBehaviors = useCallback(
    debounce((newElement: Element) => {
      triggerTextFieldBehavior('change', newElement, props.onUpdate);
    }, debounceTimeMs),
    [],
  );

  // This handler takes care of handling the state, so it shouldn't be debounced
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  const onChangeText = (value: string) => {
    const currentElement = elementRef.current;
    const newElement = updateTextFieldValue(
      currentElement,
      value,
      props.onUpdate,
    );
    elementRef.current = newElement;
    triggerChangeBehaviors(newElement);
  };

  const onSubmitEditing = () => {
    triggerTextFieldBehavior('submit', props.element, props.onUpdate);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const textInputRef: MutableRefObject<TextInput | null> = useRef(
    null as TextInput | null,
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const prevDefaultValue = useRef<string | undefined>(defaultValue);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (prevDefaultValue.current !== defaultValue) {
      onChangeText(defaultValue || '');
    }
    prevDefaultValue.current = defaultValue;
  }, [defaultValue, onChangeText]);

  const p = {
    ...createProps(props.element, props.stylesheets, {
      ...props.options,
      focused:
        typeof textInputRef.current?.isFocused === 'function'
          ? textInputRef.current?.isFocused()
          : false,
    }),
  };

  return (
    <TextInput
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...p}
      ref={(ref: ElementRef<typeof TextInput> | null) => {
        textInputRef.current = ref;
        if (props.options?.registerInputHandler) {
          props.options.registerInputHandler(ref);
        }
      }}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      editable={editable}
      keyboardType={keyboardType}
      multiline={multiline}
      onBlur={() => setFocus(false)}
      onChangeText={onChangeText}
      onFocus={() => setFocus(true)}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secureTextEntry}
      textContentType={textContentType}
    />
  );
};

HvTextField.namespaceURI = Namespaces.HYPERVIEW;
HvTextField.localName = LOCAL_NAME.TEXT_FIELD;

HvTextField.getFormInputValues = (
  element: Element,
): Array<[string, string]> => {
  return getNameValueFormInputValues(element);
};

/**
 * Formats the user's input based on element attributes.
 * Currently supports the "mask" attribute, which will be applied
 * to format the provided value.
 */
HvTextField.getFormattedValue = getFormattedValue;

export {
  getDebounceTime,
  getFormattedValue,
  triggerTextFieldBehavior,
  updateTextFieldFocus,
  updateTextFieldValue,
};

export default HvTextField;
