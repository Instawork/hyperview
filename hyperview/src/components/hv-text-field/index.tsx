import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { HvComponentProps, TextContextType } from 'hyperview/src/types';
import React, { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import {
  createProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import type { ElementRef } from 'react';
import type { KeyboardTypeOptions } from 'react-native';
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput } from 'react-native';
import TinyMask from 'hyperview/src/mask';
import debounce from 'lodash/debounce';

const HvTextField = (props: HvComponentProps) => {
  if (props.element.getAttribute('hide') === 'true') {
    return null;
  }

  // Extract known attributes into their own variables
  const autoFocus = props.element.getAttribute('auto-focus') === 'true';
  const debounceTimeMs =
    parseInt(props.element.getAttribute('debounce') || '', 10) || 0;
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
    const newElement = props.element.cloneNode(true) as Element;
    props.onUpdate(null, 'swap', props.element, { newElement });

    if (focused) {
      Behaviors.trigger('focus', newElement, props.onUpdate);
    } else {
      Behaviors.trigger('blur', newElement, props.onUpdate);
    }
  };

  // Create a memoized, debounced function to trigger the "change" behavior
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  const triggerChangeBehaviors = useCallback(
    debounce((newElement: Element) => {
      Behaviors.trigger('change', newElement, props.onUpdate);
    }, debounceTimeMs),
    [],
  );

  // This handler takes care of handling the state, so it shouldn't be debounced
  // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
  const onChangeText = (value: string) => {
    const formattedValue = HvTextField.getFormattedValue(props.element, value);
    const newElement = props.element.cloneNode(true) as Element;
    newElement.setAttribute('value', formattedValue);
    props.onUpdate(null, 'swap', props.element, { newElement });
    triggerChangeBehaviors(newElement);
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
      focused: textInputRef.current?.isFocused(),
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
HvTextField.getFormattedValue = (element: Element, value: string) => {
  if (!element.hasAttribute('mask')) {
    return value;
  }
  const mask = new TinyMask(element.getAttribute('mask'));
  // TinyMask returns undefined in some cases (like if the value is an empty string).
  // In those situations, we want the formatted value to be an empty string
  // (for proper serialization).
  return mask.mask(value) || '';
};

export default HvTextField;
