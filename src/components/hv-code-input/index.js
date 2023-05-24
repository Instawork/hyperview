import * as Dom from 'hyperview/src/services/dom';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import {
  createProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import { TextInput, View } from 'react-native';
import { createStyleProp } from 'hyperview/src/services';

const defaultLength = 4;
const NO_FOCUS = -1;

export default class HvCodeInput extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = 'code-input';


  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return [['key', 'value']];
  };

  constructor(props: HvComponentProps) {
    super(props);
    this.inputRefs = [];
  }

  setFocus = (focusedIndex: number) => {
    const newElement = this.props.element.cloneNode(true);
    if (focusedIndex === NO_FOCUS) {
      newElement.removeAttribute('focused');
    } else {
      newElement.setAttribute('focused', focusedIndex.toString());
    }
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  setValue = (value: string) => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('value', value);
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  getLength(): number {
    const lengthAttr: string | number = this.props.element.getAttribute('length') || defaultLength;
    const parsedLength: number = parseInt(lengthAttr, 10);
    return parsedLength > 0 ? parsedLength : defaultLength;
  }

  getFocusedIndex(): number {
    const parsedIndex = parseInt(this.props.element.getAttribute('focused'));
    return parsedIndex >= 0 ? parsedIndex : NO_FOCUS;
  }

  render() {
    const value: string = this.props.element.getAttribute('value') || '';
    const autoFocus = this.props.element.getAttribute('auto-focus') === 'true';
    const style = createStyleProp(this.props.element, this.props.stylesheets, this.props.options);
    const keyboardType = this.props.element.getAttribute('keyboard-type') || undefined;
    const secureTextEntry = this.props.element.getAttribute('secure-text') === 'true';
    const focusedIndex: number = this.getFocusedIndex();

    const inputs = new Array(this.getLength()).fill(undefined).map((val, i) => {
      const inputStyle = createStyleProp(this.props.element, this.props.stylesheets, { ...this.props.options, styleAttr: 'input-style', focused: i === focusedIndex });
      return <TextInput
        ref={ref => (this.inputRefs[id] = ref)}
        key={`input-${i}`}
        autoFocus={autoFocus && i === 0}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={inputStyle}
        onBlur={() => this.setFocus(NO_FOCUS)}
        onFocus={() => this.setFocus(i)}
        onChangeText={() => this.setValue('456') }
        value={value[i] ? value[i].toString() : ''}
      />;
    });
    return (
      <View style={style}>
        {inputs}
      </View>
    );
  }
}
