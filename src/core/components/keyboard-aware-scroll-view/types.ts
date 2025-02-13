import { TextInput, ScrollView } from 'react-native';

export type Props = {
  getTextInputRefs?: () => Array<TextInput> | null | undefined;
  onScroll?: ScrollView['props']['onScroll'];
  scrollToBottomOnKBShow?: boolean;
  scrollToInputAdditionalOffset?: number | null | undefined;
  startScrolledToBottom?: boolean;
};

export type State = {
  keyboardHeight: number;
  scrollBottomOnNextSizeChange: boolean;
};

export type ScrollToOptions = {
  animated: boolean;
  x: number;
  y: number;
};
