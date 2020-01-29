// @flow

import { Props as ScrollViewProps } from 'react-native/Libraries/Components/ScrollView/ScrollView';

export type ConsumerProps = {|
  id?: ?string,
  ...ScrollViewProps,
|};

export type ScrollOffset = {|
  x: number,
  y: number,
|};

export type ScrollEvent = {|
  nativeEvent: {|
    contentOffset: ScrollOffset,
  |},
|};

export type State = {|
  scrollOffsets: {
    [string]: ScrollOffset,
  },
|};
