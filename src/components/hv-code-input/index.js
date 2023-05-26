// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import type { Element, HvComponentProps } from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import {
  createStyleProp,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import CodeInput from './code-input';

const DEFAULT_LENGTH = 4;
const NO_FOCUS = -1;

export default class HvCodeInput extends PureComponent<HvComponentProps> {
  /**
   * This components wraps the CodeInput component to map it to a Hyperview element.
   * It handles reading props from the XML element, and storing state to the XML element.
   * The details of the UI are delegated to the CodeInput component.
   */

  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = 'code-input';

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  updateElement = (codeArr: Array<string>, index: number) => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('value', codeArr.join(''));
    newElement.setAttribute('focused', index.toString());
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  getLength = (): number => {
    const lengthAttr: string | number =
      this.props.element.getAttribute('length') || DEFAULT_LENGTH;
    const parsedLength: number = parseInt(lengthAttr, 10);
    return parsedLength > 0 ? parsedLength : DEFAULT_LENGTH;
  };

  getValue = (): string => {
    return this.props.element.getAttribute('value') || '';
  };

  getArrayValue = (): Array<string> => {
    return this.getValue().split('');
  };

  getFocusedIndex = (): number => {
    const parsedIndex = parseInt(
      this.props.element.getAttribute('focused'),
      10,
    );
    return parsedIndex >= 0 ? parsedIndex : NO_FOCUS;
  };

  render = () => {
    const autoFocus: boolean =
      this.props.element.getAttribute('auto-focus') === 'true';
    const keyboardType =
      this.props.element.getAttribute('keyboard-type') || undefined;
    const secureTextEntry: boolean =
      this.props.element.getAttribute('secure-text') === 'true';
    const style = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    const inputStyle = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        focused: false,
        styleAttr: 'input-style',
      },
    );
    const focusedInputStyle = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        focused: true,
        styleAttr: 'input-style',
      },
    );

    return (
      <CodeInput
        autoFocus={autoFocus}
        codeArr={this.getArrayValue()}
        codeInputStyle={inputStyle}
        codeLength={this.getLength()}
        containerStyle={style}
        currentIndex={this.getFocusedIndex()}
        focusedCodeInputStyle={focusedInputStyle}
        keyboardType={keyboardType}
        onFulfill={c => {
          console.log(c);
        }}
        secureTextEntry={secureTextEntry}
        updateState={(c, i) => this.updateElement(c, i)}
      />
    );
  };
}
