import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import { Platform, StyleSheet, Switch } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import {
  getNameValueFormInputValues,
  useStyleProp,
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
  const { element, onUpdate, stylesheets } = props;

  const hide = useMemo(() => element.getAttribute('hide') === 'true', [
    element,
  ]);

  const value = useMemo(() => element.getAttribute('value') === 'on', [
    element,
  ]);

  const unselStyle = useStyleProp(element, stylesheets, {
    selected: false,
  });

  const unselectedStyle = useMemo(() => StyleSheet.flatten(unselStyle), [
    unselStyle,
  ]);

  const selStyle = useStyleProp(element, stylesheets, {
    selected: true,
  });

  const selectedStyle = useMemo(() => StyleSheet.flatten(selStyle), [selStyle]);

  const onChange = useCallback(() => {
    const newElement = element.cloneNode(true) as Element;
    Behaviors.trigger('change', newElement, onUpdate);
  }, [element, onUpdate]);

  const onValueChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      const newElement = element.cloneNode(true) as Element;
      newElement.setAttribute('value', v ? 'on' : 'off');
      onUpdate(null, 'swap', element, { newElement });
    },
    [element, onUpdate],
  );

  const componentProps = useMemo(() => {
    const p = {
      ios_backgroundColor: unselectedStyle
        ? unselectedStyle.backgroundColor
        : null,
      onChange,
      onValueChange,
      // iOS thumbColor default
      thumbColor: unselectedStyle?.color || selectedStyle?.color,
      trackColor: {
        false: unselectedStyle ? unselectedStyle.backgroundColor : null,
        true: selectedStyle ? selectedStyle.backgroundColor : null,
      },
      value,
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

    return p;
  }, [onChange, onValueChange, unselectedStyle, selectedStyle, value]);

  const view = useMemo(() => React.createElement(Switch, componentProps), [
    componentProps,
  ]);

  if (hide) {
    return null;
  }

  return view;
};

HvSwitch.namespaceURI = Namespaces.HYPERVIEW;
HvSwitch.localName = LOCAL_NAME.SWITCH;
HvSwitch.getFormInputValues = getNameValueFormInputValues;

export default HvSwitch;
