// Source: https://github.com/wix-incubator/react-native-keyboard-aware-scrollview
// Copyright (c) 2015 Wix.com

import type {
  KeyboardEvent,
  LayoutChangeEvent,
  NativeScrollEvent,
} from 'react-native';
import type { Props, ScrollToOptions, State } from './types';
import React, { PureComponent } from 'react';
import ReactNative, {
  DeviceEventEmitter,
  Keyboard,
  ScrollView,
} from 'react-native';
import type { ElementRef } from 'react';

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: TODO(TS): fix this
    this.keyboardAwareView.layout = layout;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: TODO(TS): fix this
    this.keyboardAwareView.contentOffset = { x: 0, y: 0 };
    this.updateKeyboardAwareViewContentSize();
  };

  onKeyboardAwareViewScroll = (
    contentOffset: NativeScrollEvent['contentOffset'],
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: TODO(TS): fix this
    this.keyboardAwareView.contentOffset = contentOffset;
    this.updateKeyboardAwareViewContentSize();
  };

  updateKeyboardAwareViewContentSize = () => {
    if (this.keyboardAwareView) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: TODO(TS): fix this
      this.keyboardAwareView.measure(
        (x: number, y: number, width: number, height: number) => {
          if (this.keyboardAwareView) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: TODO(TS): fix this
            this.keyboardAwareView.contentSize = { height, width };
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
        const isFocusedFunc = textInputRef.isFocused();
        const isFocused =
          isFocusedFunc && typeof isFocusedFunc === 'function'
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: TODO(TS): fix this
              isFocusedFunc()
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
    // eslint-disable-next-line react/destructuring-assignment
    const { keyboardHeight } = this.state;
    this.setState({ keyboardHeight: 0 });

    const hasYOffset =
      this.keyboardAwareView &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: TODO(TS): fix this
      this.keyboardAwareView?.contentOffset &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: TODO(TS): fix this
      this.keyboardAwareView?.contentOffset.y !== undefined;
    const yOffset = hasYOffset
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: TODO(TS): fix this
        Math.max(this.keyboardAwareView?.contentOffset.y - keyboardHeight, 0)
      : 0;
    this.keyboardAwareView?.scrollTo({ animated: true, x: 0, y: yOffset });
  };

  scrollBottomOnNextSizeChange = () => {
    this.setState({ scrollBottomOnNextSizeChange: true });
  };

  scrollToBottom = (scrollAnimated = true) => {
    if (this.keyboardAwareView) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: TODO(TS): fix this
      if (!this.keyboardAwareView?.contentSize) {
        setTimeout(() => this.scrollToBottom(scrollAnimated), 50);
        return;
      }

      const bottomYOffset =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: TODO(TS): fix this
        this.keyboardAwareView?.contentSize.height -
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: TODO(TS): fix this
        this.keyboardAwareView?.layout.height +
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: TODO(TS): fix this
        this.keyboardAwareView?.props.contentInset.bottom;
      this.keyboardAwareView?.scrollTo({
        animated: scrollAnimated,
        x: 0,
        y: bottomYOffset,
      });
    }
  };

  scrollTo = (options: ScrollToOptions) => {
    if (this.keyboardAwareView) {
      this.keyboardAwareView?.scrollTo(options);
    }
  };

  render() {
    return (
      <ScrollView
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
        ref={r => {
          this.keyboardAwareView = r;
        }}
        contentInset={{ bottom: this.state.keyboardHeight }}
        onContentSizeChange={() => {
          this.updateKeyboardAwareViewContentSize();
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
        scrollEventThrottle={200}
      />
    );
  }
}
