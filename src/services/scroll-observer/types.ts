import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type ScrollOffset = {
  x: number;
  y: number;
};

export type Offsets = { [key: string]: ScrollOffset };

export type ScrollEvent = {
  nativeEvent: {
    contentOffset: ScrollOffset;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConsumerProps = any;

export type ScrollableComponentType = {
  id?: string;
  onScroll?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProviderComponentType = any;
