// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  Document,
  StyleSheet as StyleSheetType,
  StyleSheets,
} from 'hyperview/src/types';
import { StyleSheet } from 'react-native';

const NUMBER_REGEX = /^\d+$/;

/**
 * no-op that returns the string value
 */
function string(value: string): string {
  return value;
}

/**
 * Converts the string value to a base-10 number.
 */
function number(value: string): number {
  return parseInt(value, 10);
}

/**
 * Converts the string value to a float number.
 */
function floatNumber(value: string): number {
  return parseFloat(value);
}

/**
 * If the string value has a "%", return the original string value.
 * Otherwise, converts the string value to a base-10 number.
 */
function numberOrPercent(value: string): number | string {
  return value.indexOf('%') >= 0 ? value : number(value);
}

/**
 * If the string value is all numeric digits, convert it to a base-10 number.
 * Otherwise, return the original string value.
 */
function numberOrString(value: string): number | string {
  return NUMBER_REGEX.test(value) ? number(value) : value;
}

// Maps certain style attributes to the converter to use. The converted values
// should be accepted style types in React Native.
// If a style attribute is not in this list, it will not be applied to the element.
const STYLE_ATTRIBUTE_CONVERTERS = {
  // layout attributes
  alignContent: string,
  alignItems: string,
  alignSelf: string,
  borderBottomWidth: number,
  borderLeftWidth: number,
  borderRightWidth: number,
  borderTopWidth: number,
  borderWidth: number,
  bottom: numberOrPercent,
  display: string,
  elevation: number,
  flex: number,
  flexBasis: number,
  flexDirection: string,
  flexGrow: number,
  flexShrink: number,
  flexWrap: string,
  height: numberOrPercent,
  justifyContent: string,
  left: numberOrPercent,
  margin: numberOrPercent,
  marginBottom: numberOrPercent,
  marginHorizontal: numberOrPercent,
  marginLeft: numberOrPercent,
  marginRight: numberOrPercent,
  marginTop: numberOrPercent,
  marginVertical: numberOrPercent,
  maxHeight: numberOrPercent,
  maxWidth: numberOrPercent,
  minHeight: numberOrPercent,
  minWidth: numberOrPercent,
  overflow: string,
  padding: numberOrString,
  paddingBottom: numberOrPercent,
  paddingHorizontal: numberOrPercent,
  paddingLeft: numberOrPercent,
  paddingRight: numberOrPercent,
  paddingTop: numberOrPercent,
  paddingVertical: numberOrPercent,
  position: string,
  right: numberOrPercent,
  top: numberOrPercent,
  width: numberOrPercent,

  // view attributes
  borderRightColor: string,
  borderBottomColor: string,
  borderBottomLeftRadius: number,
  borderBottomRightRadius: number,
  borderColor: string,
  borderLeftColor: string,
  borderRadius: number,
  backgroundColor: string,
  borderStyle: string,
  borderTopColor: string,
  borderTopLeftRadius: number,
  borderTopRightRadius: number,
  opacity: floatNumber,
  shadowColor: string,
  shadowOffsetX: number,
  shadowOffsetY: number,
  shadowOpacity: floatNumber,
  shadowRadius: number,

  // text attributes
  color: string,
  fontSize: number,
  fontStyle: string,
  fontWeight: string,
  lineHeight: number,
  textAlign: string,
  textDecorationLine: string,
  textShadowColor: string,
  fontFamily: string,
  textShadowRadius: number,

  // image attributes
  resizeMode: string,
};

function createStylesheet(document: Document, modifiers = {}): StyleSheetType {
  const styles = Dom.getFirstTag(document, 'styles');
  const stylesheet = {};
  if (styles) {
    const styleElements = styles.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'style',
    );

    for (let i = 0; i < styleElements.length; i += 1) {
      const styleElement = styleElements.item(i);
      const hasModifier =
        styleElement.parentNode &&
        styleElement.parentNode.tagName === 'modifier';

      let styleId = styleElement.getAttribute('id');
      if (hasModifier) {
        // TODO(adam): Use less hacky way to get id of parent style element.
        styleId = styleElement.parentNode.parentNode.getAttribute('id');
      }

      // This must be a root style or a modifier style
      if (!styleId) {
        // TODO: https://eslint.org/docs/rules/no-continue
        continue; // eslint-disable-line
      }

      const modifierEntries = Object.entries(modifiers);

      let matchesModifiers = true;
      for (let j = 0; j < modifierEntries.length; j += 1) {
        const [modifier, state] = modifierEntries[j];

        const elementModifierState =
          styleElement.parentNode.getAttribute(modifier) === 'true';

        if (elementModifierState !== state) {
          matchesModifiers = false;
          // TODO: https://eslint.org/docs/rules/no-continue
          continue; // eslint-disable-line
        }
      }
      if (!matchesModifiers) {
        // TODO: https://eslint.org/docs/rules/no-continue
        continue; // eslint-disable-line
      }

      const rules = {};
      for (let j = 0; j < styleElement.attributes.length; j += 1) {
        const attr = styleElement.attributes.item(j);
        const converter = STYLE_ATTRIBUTE_CONVERTERS[attr.name];
        if (converter) {
          rules[attr.name] = converter(attr.value);
        }
      }

      // Shadow offset numbers needs to be be converted into a single object
      // on the style sheet.
      if (
        rules.shadowOffsetX !== undefined ||
        rules.shadowOffsetY !== undefined
      ) {
        rules.shadowOffset = {
          width: rules.shadowOffsetX,
          height: rules.shadowOffsetY,
        };
        delete rules.shadowOffsetX;
        delete rules.shadowOffsetY;
      }

      stylesheet[styleId] = rules;
    }
  }

  return StyleSheet.create(stylesheet);
}

export function createStylesheets(document: Document): StyleSheets {
  const styles = {
    regular: createStylesheet(document, {
      selected: false,
      pressed: false,
      focused: false,
    }),
    selected: createStylesheet(document, {
      selected: true,
      pressed: false,
      focused: false,
    }),
    pressed: createStylesheet(document, {
      selected: false,
      pressed: true,
      focused: false,
    }),
    focused: createStylesheet(document, {
      selected: false,
      pressed: false,
      focused: true,
    }),
    pressedSelected: createStylesheet(document, {
      selected: true,
      pressed: true,
      focused: false,
    }),
  };
  return styles;
}
