import type { HvComponentProps } from 'hyperview';
import Hyperview from 'hyperview';
import React from 'react';
import { View } from 'react-native';
import { namespace } from './types';

const BottomSheetStopPoint = (props: HvComponentProps) => {
  return (
    <View>
      <Hyperview.HvChildren
        element={props.element}
        onUpdate={props.onUpdate}
        options={props.options}
        stylesheets={props.stylesheets}
      />
    </View>
  );
};

BottomSheetStopPoint.namespaceURI = namespace;
BottomSheetStopPoint.localName = 'stop-point';

export { BottomSheetStopPoint };
