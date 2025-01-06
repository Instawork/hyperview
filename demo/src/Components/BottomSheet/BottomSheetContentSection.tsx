import type { HvComponentProps, LocalName } from 'hyperview';
import { LayoutChangeEvent, View } from 'react-native';
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

  const children = Hyperview.renderChildren(
    props.element,
    props.stylesheets,
    props.onUpdate,
    props.options,
  );
  return <View onLayout={onLayout}>{children}</View>;
};

BottomSheetContentSection.namespaceURI = namespace;
BottomSheetContentSection.localName = 'content-section' as LocalName;
BottomSheetContentSection.localNameAliases = [] as LocalName[];

export { BottomSheetContentSection };
