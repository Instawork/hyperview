// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import { TextInput, View } from 'react-native';
import type { CodeInputProps } from './types';

export default class CodeInput extends PureComponent<CodeInputProps> {
  /**
   * This components wraps the CodeInput component to map it to a Hyperview element.
   * It handles reading props from the XML element, and storing state to the XML element.
   * The details of the UI are delegated to the CodeInput component.
   */

  codeInputRefs: Array<React$ElementRef<typeof TextInput>> = [];

  setFocus = (index: number) => this.codeInputRefs[index].focus();

  setBlur = (index: number) => this.codeInputRefs[index].blur();

  onFocus = (index: number) => () => {
    // eslint-disable-next-line prefer-destructuring
    const codeArr: Array<string> = this.props.codeArr;
    const currentEmptyIndex = codeArr.findIndex(c => !c);
    if (currentEmptyIndex !== -1 && currentEmptyIndex < index) {
      this.setFocus(currentEmptyIndex);
    }
    const newCodeArr = codeArr.map((v, i) => (i < index ? v : ''));

    this.props.updateState(newCodeArr, index);
  };

  onKeyPress = (e: any) => {
    // Move to the previous input on backspace
    if (e.nativeEvent.key === 'Backspace') {
      // eslint-disable-next-line prefer-destructuring
      const currentIndex: number = this.props.currentIndex;
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      this.setFocus(nextIndex);
    }
  };

  onInputCode = (index: number) => (text: string) => {
    // eslint-disable-next-line prefer-destructuring
    const codeLength: number = this.props.codeLength;
    // eslint-disable-next-line prefer-destructuring
    const onFulfill: (code: string) => void = this.props.onFulfill;
    const textLen: number = text.length;

    // Add the text at the given index of the code array
    let newCodeArr = [...this.props.codeArr];
    newCodeArr[index] = text;

    // 'text' is usually a single character. However,
    // it is possible the user will paste or auto-fill
    // the entire code, in which case 'text' may contain multiple
    // characters. This line (join and split) will create an array of
    // characters even in this edge case.
    newCodeArr = newCodeArr.join('').split('');

    if (index === codeLength - textLen) {
      // Code is completely entered, trigger callback and blur the input.
      const code = newCodeArr.join('');
      onFulfill(code);
      this.setBlur(this.props.currentIndex);
    } else {
      // Code is not completely entered, proceed to next field
      this.setFocus(this.props.currentIndex + textLen);
    }

    // Parent component saves the state of the code and current focused field.
    this.props.updateState(newCodeArr, this.props.currentIndex + textLen);
  };

  focus = () => this.setFocus(this.props.currentIndex);

  blur = () => this.setBlur(this.props.currentIndex);

  render() {
    /* eslint-disable prefer-destructuring */
    const autoFocus: boolean = this.props.autoFocus;
    const codeInputStyle: Array<StyleSheet> = this.props.codeInputStyle;
    const codeLength: number = this.props.codeLength;
    const containerStyle: Array<StyleSheet> = this.props.containerStyle;
    const focusedCodeInputStyle: Array<StyleSheet> = this.props
      .focusedCodeInputStyle;
    const keyboardType = this.props.keyboardType;
    const secureTextEntry: boolean = this.props.secureTextEntry;
    /* eslint-enable */
    const range = new Array(codeLength).fill(undefined).map((_, i) => i);
    const codeInputs = range.map(id => (
      <TextInput
        key={id}
        ref={ref => {
          this.codeInputRefs[id] = ref;
        }}
        autoFocus={autoFocus && id === 0}
        keyboardType={keyboardType}
        maxLength={codeLength - id}
        onChangeText={this.onInputCode(id)}
        onFocus={this.onFocus(id)}
        onKeyPress={this.onKeyPress}
        returnKeyType="done"
        secureTextEntry={secureTextEntry}
        selectionColor="transparent"
        style={[
          codeInputStyle,
          id === this.props.currentIndex ? focusedCodeInputStyle : null,
        ]}
        underlineColorAndroid="transparent"
        value={this.props.codeArr[id] ? this.props.codeArr[id].toString() : ''}
      />
    ));

    return <View style={containerStyle}>{codeInputs}</View>;
  }
}
