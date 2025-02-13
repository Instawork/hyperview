// Source: https://github.com/wix-incubator/react-native-keyboard-aware-scrollview
// Copyright (c) 2015 Wix.com

import React from 'react';
import PropTypes from 'prop-types';

import { ScrollView } from 'react-native';

import KeyboardAwareBase from './KeyboardAwareBase';

export default class KeyboardAwareScrollView extends KeyboardAwareBase {
  render() {
    return (
      <ScrollView
        {...this.props}
        {...this.style}
        contentInset={{ bottom: this.state.keyboardHeight }}
        ref={r => {
          this._keyboardAwareView = r;
        }}
        onLayout={layoutEvent => {
          this._onKeyboardAwareViewLayout(layoutEvent.nativeEvent.layout);
        }}
        onScroll={event => {
          this._onKeyboardAwareViewScroll(event.nativeEvent.contentOffset);
          if (this.props.onScroll) {
            this.props.onScroll(event);
          }
        }}
        onContentSizeChange={() => {
          this._updateKeyboardAwareViewContentSize();
        }}
        scrollEventThrottle={200}
      />
    );
  }
}

KeyboardAwareScrollView.propTypes = {
  getTextInputRefs: PropTypes.func,
  onScroll: PropTypes.func,
};
KeyboardAwareScrollView.defaultProps = {
  ...KeyboardAwareBase.defaultProps,
  getTextInputRefs: () => {
    return [];
  },
};
