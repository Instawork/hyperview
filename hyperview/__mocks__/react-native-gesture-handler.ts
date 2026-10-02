import mocks, {
  BaseButton,
  BorderlessButton,
  RawButton,
  RectButton,
} from 'react-native-gesture-handler/src/mocks/mocks';

export { BaseButton, BorderlessButton, RawButton, RectButton };

export const {
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Switch,
  TextInput,
  DrawerLayoutAndroid,
  NativeViewGestureHandler,
  TapGestureHandler,
  ForceTouchGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
  PanGestureHandler,
  attachGestureHandler,
  createGestureHandler,
  dropGestureHandler,
  updateGestureHandler,
  flushOperations,
} = mocks;
