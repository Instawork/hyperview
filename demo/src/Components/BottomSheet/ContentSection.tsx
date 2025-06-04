import { LayoutChangeEvent, View } from 'react-native';
import type { HvComponentProps } from 'hyperview';
import Hyperview from 'hyperview';
import React from 'react';
import { namespace } from './types';
import { useBottomSheetContext } from '../../Contexts/BottomSheet';

const BottomSheetContentSection = (props: HvComponentProps) => {
  const key = props.element.getAttribute('key');

  const { setContentSectionHeight } = useBottomSheetContext();
  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height: sheetHeight } = event.nativeEvent.layout;
      setContentSectionHeight?.(key ? parseInt(key, 10) : -1, sheetHeight);
    },
    [key, setContentSectionHeight],
  );

  return (
    <View onLayout={onLayout}>
      <Hyperview.HvChildren
        element={props.element}
        onUpdate={props.onUpdate}
        options={props.options}
        stylesheets={props.stylesheets}
      />
    </View>
  );
};

BottomSheetContentSection.namespaceURI = namespace;
BottomSheetContentSection.localName = 'content-section';

export { BottomSheetContentSection };
