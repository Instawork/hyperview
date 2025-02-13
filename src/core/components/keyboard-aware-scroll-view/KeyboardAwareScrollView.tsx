// Source: https://github.com/wix-incubator/react-native-keyboard-aware-scrollview
// Copyright (c) 2015 Wix.com

import React, { PureComponent } from 'react';
import ReactNative, {
  DeviceEventEmitter,
  Keyboard,
  ScrollView,
} from 'react-native';
import type { ScrollToOptions, Props, State } from './types';
import type { ElementRef } from 'react';
import type {
  KeyboardEvent,
  LayoutChangeEvent,
  NativeScrollEvent,
} from 'react-native';

const defaultScrollToInputAdditionalOffset = 75;

export default class KeyboardAwareScrollView extends PureComponent<
  Props,
  State
> {
  keyboardAwareView: ElementRef<typeof ScrollView> | null = null;
  keyboardEventListeners: Array<{ remove: () => void }> = [];

  constructor(props: Props) {
    super(props);
    this.state = { keyboardHeight: 0, scrollBottomOnNextSizeChange: false };
    this.addKeyboardEventListeners();
  }

  componentDidMount() {
    if (this.keyboardAwareView && this.props.startScrolledToBottom) {
      this.scrollToBottom(false);
      setTimeout(
        () => this.keyboardAwareView?.setNativeProps({ opacity: 1 }),
        100,
      );
    }
  }

  componentWillUnmount() {
    this.removeKeyboardListeners();
  }

  addKeyboardEventListeners = () => {
    const KeyboardEventsObj = Keyboard || DeviceEventEmitter;
    this.keyboardEventListeners = [
      KeyboardEventsObj.addListener(
        'keyboardWillShow',
        this.onKeyboardWillShow,
      ),
      KeyboardEventsObj.addListener(
        'keyboardWillHide',
        this.onKeyboardWillHide,
      ),
    ];
  };

  removeKeyboardListeners = () => {
    this.keyboardEventListeners.forEach(eventListener =>
      eventListener.remove(),
    );
  };

  onKeyboardAwareViewLayout = (
    layout: LayoutChangeEvent['nativeEvent']['layout'],
  ) => {
    // @ts-ignore: TODO(TS): fix this
    this.keyboardAwareView?.layout = layout;
    // @ts-ignore: TODO(TS): fix this
    this.keyboardAwareView?.contentOffset = { x: 0, y: 0 };
    this.updateKeyboardAwareViewContentSize();
  };

  onKeyboardAwareViewScroll = (
    contentOffset: NativeScrollEvent['contentOffset'],
  ) => {
    // @ts-ignore: TODO(TS): fix this
    this.keyboardAwareView?.contentOffset = contentOffset;
    this.updateKeyboardAwareViewContentSize();
  };

  updateKeyboardAwareViewContentSize = () => {
    if (this.keyboardAwareView) {
      // @ts-ignore: TODO(TS): fix this
      this.keyboardAwareView.measure(
        (x: number, y: number, width: number, height: number) => {
          if (this.keyboardAwareView) {
            // @ts-ignore: TODO(TS): fix this
            this.keyboardAwareView.contentSize = { width, height };
            if (this.state.scrollBottomOnNextSizeChange) {
              this.scrollToBottom();
              this.setState({ scrollBottomOnNextSizeChange: false });
            }
          }
        },
      );
    }
  };

  scrollToFocusedTextInput = () => {
    if (this.props.getTextInputRefs) {
      const textInputRefs = this.props.getTextInputRefs();
      textInputRefs?.some(textInputRef => {
        const isFocusedFunc = textInputRef.isFocused() as boolean | Function;
        const isFocused =
          isFocusedFunc && typeof isFocusedFunc === 'function'
            ? isFocusedFunc()
            : isFocusedFunc;
        if (isFocused) {
          setTimeout(() => {
            this.keyboardAwareView
              ?.getScrollResponder()
              .scrollResponderScrollNativeHandleToKeyboard(
                ReactNative.findNodeHandle(textInputRef),
                this.props.scrollToInputAdditionalOffset ||
                  defaultScrollToInputAdditionalOffset,
                true,
              );
          }, 0);
        }
        return isFocused;
      });
    }
  };

  onKeyboardWillShow = (event: KeyboardEvent) => {
    this.scrollToFocusedTextInput();

    const newKeyboardHeight = event.endCoordinates.height;
    if (this.state.keyboardHeight === newKeyboardHeight) {
      return;
    }

    this.setState({ keyboardHeight: newKeyboardHeight });

    if (this.props.scrollToBottomOnKBShow) {
      this.scrollToBottom();
    }
  };

  onKeyboardWillHide = () => {
    const keyboardHeight = this.state.keyboardHeight;
    this.setState({ keyboardHeight: 0 });

    const hasYOffset =
      this.keyboardAwareView &&
      // @ts-ignore: TODO(TS): fix this
      this.keyboardAwareView?.contentOffset &&
      // @ts-ignore: TODO(TS): fix this
      this.keyboardAwareView?.contentOffset.y !== undefined;
    const yOffset = hasYOffset
      ? // @ts-ignore: TODO(TS): fix this
        Math.max(this.keyboardAwareView?.contentOffset.y - keyboardHeight, 0)
      : 0;
    this.keyboardAwareView?.scrollTo({ x: 0, y: yOffset, animated: true });
  };

  scrollBottomOnNextSizeChange = () => {
    this.setState({ scrollBottomOnNextSizeChange: true });
  };

  scrollToBottom = (scrollAnimated = true) => {
    if (this.keyboardAwareView) {
      // @ts-ignore: TODO(TS): fix this
      if (!this.keyboardAwareView?.contentSize) {
        setTimeout(() => this.scrollToBottom(scrollAnimated), 50);
        return;
      }

      const bottomYOffset =
        // @ts-ignore: TODO(TS): fix this
        this.keyboardAwareView?.contentSize.height -
        // @ts-ignore: TODO(TS): fix this
        this.keyboardAwareView?.layout.height +
        // @ts-ignore: TODO(TS): fix this
        this.keyboardAwareView?.props.contentInset.bottom;
      this.keyboardAwareView?.scrollTo({
        x: 0,
        y: bottomYOffset,
        animated: scrollAnimated,
      });
    }
  };

  scrollTo = (options: ScrollToOptions) => {
    if (this.keyboardAwareView) this.keyboardAwareView?.scrollTo(options);
  };

  render() {
    return (
      <ScrollView
        {...this.props}
        contentInset={{ bottom: this.state.keyboardHeight }}
        ref={r => {
          this.keyboardAwareView = r;
        }}
        onLayout={layoutEvent => {
          this.onKeyboardAwareViewLayout(layoutEvent.nativeEvent.layout);
        }}
        onScroll={event => {
          this.onKeyboardAwareViewScroll(event.nativeEvent.contentOffset);
          if (this.props.onScroll) {
            this.props.onScroll(event);
          }
        }}
        onContentSizeChange={() => {
          this.updateKeyboardAwareViewContentSize();
        }}
        scrollEventThrottle={200}
      />
    );
  }
}
