import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { Platform, StyleSheet, Switch } from 'react-native';
import React, { useMemo } from 'react';
import {
  createStyleProp,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import type { ColorValue } from './style-sheet';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import normalizeColor from './style-sheet';

/* eslint no-bitwise: ["error", { "allow": [">>", "&"] }] */
function darkenColor(color: ColorValue, percent: number): ColorValue {
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
}

const HvSwitch = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element, onUpdate, options, stylesheets } = props;
  const { styleAttr } = options;
  const unselectedStyle = useMemo(() => {
    return StyleSheet.flatten(
      createStyleProp(element, stylesheets, {
        selected: false,
        styleAttr,
      }),
    );
  }, [element, styleAttr, stylesheets]);

  const selectedStyle = useMemo(() => {
    return StyleSheet.flatten(
      createStyleProp(element, stylesheets, {
        selected: true,
        styleAttr,
      }),
    );
  }, [element, styleAttr, stylesheets]);

  if (element.getAttribute('hide') === 'true') {
    return null;
  }

  const p = {
    ios_backgroundColor: unselectedStyle
      ? unselectedStyle.backgroundColor
      : null,
    onChange: () => {
      const newElement = element.cloneNode(true) as Element;
      Behaviors.trigger('change', newElement, onUpdate);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onValueChange: (value: any) => {
      const newElement = element.cloneNode(true) as Element;
      newElement.setAttribute('value', value ? 'on' : 'off');
      onUpdate(null, 'swap', element, { newElement });
    },
    // iOS thumbColor default
    thumbColor: unselectedStyle?.color || selectedStyle?.color,
    trackColor: {
      false: unselectedStyle ? unselectedStyle.backgroundColor : null,
      true: selectedStyle ? selectedStyle.backgroundColor : null,
    },
    value: element.getAttribute('value') === 'on',
  };

  // android thumbColor default
  if (Platform.OS === 'android' && !p.thumbColor && p.trackColor.true) {
    p.thumbColor = p.value ? darkenColor(p.trackColor.true, 0.3) : '#FFFFFF';
  }

  // if thumbColors are explicitly specified, override defaults
  if (p.value && selectedStyle?.color) {
    p.thumbColor = selectedStyle.color;
  } else if (!p.value && unselectedStyle?.color) {
    p.thumbColor = unselectedStyle.color;
  }

  return React.createElement(Switch, p);
};

HvSwitch.namespaceURI = Namespaces.HYPERVIEW;
HvSwitch.localName = LOCAL_NAME.SWITCH;
HvSwitch.getFormInputValues = getNameValueFormInputValues;

export default HvSwitch;
