import type { HvComponentProps, LocalName } from 'hyperview';
import Hyperview from 'hyperview';
import React, { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useBottomSheetContext } from '../../Contexts/BottomSheet';

const namespace = 'https://hyperview.org/bottom-sheet';

const BottomSheetContentSection = (props: HvComponentProps) => {
  const key = props.element.getAttribute('key');

  const { setContentSectionHeight } = useBottomSheetContext();
  const onLayout = (event: LayoutChangeEvent) => {
    const { height: sheetHeight } = event.nativeEvent.layout;
    setContentSectionHeight?.(key ? parseInt(key, 10) : -1, sheetHeight);
  };

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
