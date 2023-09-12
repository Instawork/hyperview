// @flow

import type { Element, StyleSheet, StyleSheets } from 'hyperview/src/types';
import { Platform, StyleSheet as RNStyleSheet } from 'react-native';
import type { ColorValue } from './style-sheet';
import type { Colors } from './types';
import { createStyleProp } from 'hyperview/src/services';
import normalizeColor from './style-sheet';

/* eslint no-bitwise: ["error", { "allow": [">>", "&"] }] */
const darkenColor = (color: ColorValue, percent: number): ColorValue => {
  const normalized = Number(normalizeColor(color)).toString(16);
  const A = String(normalized).slice(6);
  const RGB = parseInt(String(normalized).slice(0, 6), 16);
  const R = RGB >> 16;
  const G = (RGB >> 8) & 0x00ff;
  const B = RGB & 0x0000ff;
  const newRgb = (
    0x1000000 +
    (Math.round((0 - R) * percent) + R) * 0x10000 +
    (Math.round((0 - G) * percent) + G) * 0x100 +
    (Math.round((0 - B) * percent) + B)
  )
    .toString(16)
    .slice(1);

  return `#${newRgb}${A}`;
};

const format = (styles: StyleSheet[], selected: boolean = false): Colors => {
  const s = RNStyleSheet.flatten(styles);
  const colors = {
    iosBackgroundColor: String(s?.backgroundColor),
    thumbColor: String(s?.color),
    trackColor: {
      false: String(s?.backgroundColor),
      true: String(s?.backgroundColor),
    },
  };
  // android thumbColor default
  if (
    Platform.OS === 'android' &&
    !colors.thumbColor &&
    colors.trackColor.true
  ) {
    colors.thumbColor = selected
      ? darkenColor(colors.trackColor.true, 0.3)
      : '#FFFFFF';
  }
  return colors;
};

export const getColors = (
  element: Element,
  stylesheets: StyleSheets,
): Colors => {
  const disabled = element.getAttribute('disabled') === 'true';
  const selected = element.getAttribute('value') === 'on';
  const regularStyle = createStyleProp(element, stylesheets, {});
  if (disabled) {
    const disabledStyle = createStyleProp(element, stylesheets, {
      disabled: true,
    });
    if (selected) {
      const disabledSelectedStyle = createStyleProp(element, stylesheets, {
        disabled: true,
        selected: true,
      });
      return format(
        [...regularStyle, ...disabledStyle, ...disabledSelectedStyle],
        true,
      );
    }
    return format([...regularStyle, ...disabledStyle]);
  }
  if (selected) {
    const selectedStyle = createStyleProp(element, stylesheets, {
      selected: true,
    });
    return format([...regularStyle, ...selectedStyle], true);
  }
  return format(regularStyle);
};
