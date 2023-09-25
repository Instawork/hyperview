/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import React, { MutableRefObject, useCallback, useRef } from 'react';
import {
  createProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput } from 'react-native';
import TinyMask from 'hyperview/src/mask.js';
import debounce from 'lodash/debounce';

const HvTextField = (props: HvComponentProps) => {
  if (props.element.localName === LOCAL_NAME.TEXT_AREA) {
    console.warn(
      'Deprecation notice: <text-area> tag is deprecated and will be removed in a future version. See https://hyperview.org/docs/reference_textarea for details.',
    );
  }

  if (props.element.getAttribute('hide') === 'true') {
    return null;
  }

  // Extract known attributes into their own variables
  const autoFocus = props.element.getAttribute('auto-focus') === 'true';
  const debounceTimeMs = Dom.safeParseIntAttribute(props.element, 'debounce') ?? 0;
  const defaultValue = props.element.getAttribute('value');
  const editable = props.element.getAttribute('editable') !== 'false';
  const keyboardType = props.element.getAttribute('keyboard-type') || undefined;
  const multiline =
    props.element.localName === LOCAL_NAME.TEXT_AREA ||
    props.element.getAttribute('multiline') === 'true';
  const secureTextEntry = props.element.getAttribute('secure-text') === 'true';
  const textContentType =
    props.element.getAttribute('text-content-type') || 'none';

  // Handlers
  const setFocus = (focused: boolean) => {
    const newElement = props.element.cloneNode(true);
    if (props.onUpdate !== null) {
      props.onUpdate(null, 'swap', props.element, { newElement });


      if (focused) {
        Behaviors.trigger('focus', newElement, props.onUpdate);
      } else {
        Behaviors.trigger('blur', newElement, props.onUpdate);
      }
    }
  };

  // Create a memoized, debounced function to trigger the "change" behavior
  const triggerChangeBehaviors = useCallback(
    debounce((newElement: Element) => {
      if (props.onUpdate !== null) {
        Behaviors.trigger('change', newElement, props.onUpdate);
      }
    }, debounceTimeMs),
    [],
  );

  // This handler takes care of handling the state, so it shouldn't be debounced
  const onChangeText = (value: string) => {
    const formattedValue = HvTextField.getFormattedValue(props.element, value);
    const newElement = props.element.cloneNode(true);
    newElement.setAttribute('value', formattedValue);
    if (props.onUpdate !== null) {
      props.onUpdate(null, 'swap', props.element, { newElement });
    }
    triggerChangeBehaviors(newElement);
  };

  const textInputRef: MutableRefObject<TextInput | null> = useRef(null as TextInput | null);

  const p = {
    ...createProps(props.element, props.stylesheets, {
      ...props.options,
      focused: textInputRef.current?.isFocused(),
    }),
  };

  return (
    <TextInput
      {...p}
      ref={(ref: React.ElementRef | typeof TextInput | null) => {
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
HvTextField.localNameAliases = [LOCAL_NAME.TEXT_AREA];
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
