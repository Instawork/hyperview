import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
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

/**
 * If the string value is a float number, convert it to one.
 * Otherwise, return the original string value.
 */
function floatOrString(value: string): number | string {
  const float = parseFloat(value);
  return Number.isNaN(float) ? value : float;
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
  borderEndWidth: number,
  borderLeftWidth: number,
  borderRightWidth: number,
  borderStartWidth: number,
  borderTopWidth: number,
  borderWidth: number,
  bottom: numberOrPercent,
  boxSizing: string,
  columnGap: number,
  direction: string,
  display: string,
  end: string,
  flex: number,
  flexBasis: numberOrString,
  flexDirection: string,
  flexGrow: number,
  flexShrink: number,
  flexWrap: string,
  gap: number,
  height: numberOrPercent,
  justifyContent: string,
  left: numberOrPercent,
  margin: numberOrPercent,
  marginBottom: numberOrPercent,
  marginEnd: numberOrPercent,
  marginHorizontal: numberOrPercent,
  marginLeft: numberOrPercent,
  marginRight: numberOrPercent,
  marginStart: numberOrPercent,
  marginTop: numberOrPercent,
  marginVertical: numberOrPercent,
  maxHeight: numberOrPercent,
  maxWidth: numberOrPercent,
  minHeight: numberOrPercent,
  minWidth: numberOrPercent,
  overflow: string,
  padding: numberOrString,
  paddingBottom: numberOrPercent,
  paddingEnd: numberOrPercent,
  paddingHorizontal: numberOrPercent,
  paddingLeft: numberOrPercent,
  paddingRight: numberOrPercent,
  paddingStart: numberOrPercent,
  paddingTop: numberOrPercent,
  paddingVertical: numberOrPercent,
  position: string,
  right: numberOrPercent,
  rowGap: number,
  start: string,
  top: numberOrPercent,
  width: numberOrPercent,
  zIndex: number,

  // view attributes
  // eslint-disable-next-line sort-keys
  aspectRatio: floatOrString,
  backgroundColor: string,
  borderBlockColor: string,
  borderBlockEndColor: string,
  borderBlockStartColor: string,
  borderBottomColor: string,
  borderBottomEndRadius: string,
  borderBottomLeftRadius: number,
  borderBottomRightRadius: number,
  borderBottomStartRadius: string,
  borderColor: string,
  borderCurve: string,
  borderEndColor: string,
  borderEndEndRadius: string,
  borderEndStartRadius: string,
  borderLeftColor: string,
  borderRadius: number,
  borderRightColor: string,
  borderStartColor: string,
  borderStartEndRadius: string,
  borderStartStartRadius: string,
  borderStyle: string,
  borderTopColor: string,
  borderTopEndRadius: string,
  borderTopLeftRadius: number,
  borderTopRightRadius: number,
  borderTopStartRadius: string,
  boxShadow: string,
  cursor: string,
  elevation: number,
  filter: string,
  opacity: floatNumber,
  outlineColor: string,
  outlineOffset: numberOrString,
  outlineStyle: string,
  outlineWidth: numberOrString,
  pointerEvents: string,
  shadowColor: string,
  shadowOffsetX: number,
  shadowOffsetY: number,
  shadowOpacity: floatNumber,
  shadowRadius: number,

  // text attributes
  // eslint-disable-next-line sort-keys
  color: string,
  fontFamily: string,
  fontSize: number,
  fontStyle: string,
  fontVariant: string,
  fontWeight: string,
  includeFontPadding: string,
  letterSpacing: numberOrString,
  lineHeight: number,
  textAlign: string,
  textAlignVertical: string,
  textDecorationColor: string,
  textDecorationLine: string,
  textDecorationStyle: string,
  textShadowColor: string,
  textShadowOffsetX: number,
  textShadowOffsetY: number,
  textShadowRadius: number,
  textTransform: string,
  userSelect: string,
  verticalAlign: string,
  writingDirection: string,

  // image attributes
  // eslint-disable-next-line sort-keys
  backfaceVisibility: string,
  objectFit: string,
  overlayColor: string,
  resizeMode: string,
  tintColor: string,
} as const;

function createStylesheet(document: Document, modifiers = {}): StyleSheetType {
  const styles = Dom.getFirstTag(document, 'styles');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stylesheet: Record<string, any> = {};
  if (styles) {
    const styleElements = styles.getElementsByTagNameNS(
      Namespaces.HYPERVIEW,
      'style',
    );

    for (let i = 0; i < styleElements.length; i += 1) {
      const styleElement = styleElements.item(i);
      const hasModifier =
        (styleElement?.parentNode as Element)?.tagName === 'modifier';

      let styleId = styleElement?.getAttribute('id');
      if (hasModifier) {
        // TODO(adam): Use less hacky way to get id of parent style element.
        styleId = (styleElement?.parentNode
          ?.parentNode as Element)?.getAttribute('id');
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
          (styleElement?.parentNode as Element)?.getAttribute(modifier) ===
          'true';

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rules: Record<string, any> = {};
      if (
        styleElement?.attributes !== null &&
        typeof styleElement?.attributes !== 'undefined'
      ) {
        for (let j = 0; j < styleElement.attributes.length; j += 1) {
          const attr = styleElement.attributes.item(j);
          if (attr !== null && typeof attr !== 'undefined') {
            const converter =
              STYLE_ATTRIBUTE_CONVERTERS[
                attr.name as keyof typeof STYLE_ATTRIBUTE_CONVERTERS
              ];
            if (converter) {
              rules[attr.name] = converter(attr.value);
            }
          }
        }
      }

      // Shadow offset numbers needs to be be converted into a single object
      // on the style sheet.
      if (
        rules.shadowOffsetX !== undefined ||
        rules.shadowOffsetY !== undefined
      ) {
        rules.shadowOffset = {
          height: rules.shadowOffsetY,
          width: rules.shadowOffsetX,
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
    focused: createStylesheet(document, {
      focused: true,
      pressed: false,
      selected: false,
    }),
    pressed: createStylesheet(document, {
      focused: false,
      pressed: true,
      selected: false,
    }),
    pressedSelected: createStylesheet(document, {
      focused: false,
      pressed: true,
      selected: true,
    }),
    regular: createStylesheet(document, {
      focused: false,
      pressed: false,
      selected: false,
    }),
    selected: createStylesheet(document, {
      focused: false,
      pressed: false,
      selected: true,
    }),
  } as const;
  return styles;
}
