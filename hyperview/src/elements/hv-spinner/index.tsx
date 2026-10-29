import * as Namespaces from 'hyperview/src/services/namespaces';
import { ActivityIndicator } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';

const HvSpinner = (props: HvComponentProps) => {
  const color = props.element.getAttribute('color') || '#8d9494';
  const testID = props.element.getAttribute('id') || undefined;

  return <ActivityIndicator color={color} testID={testID} />;
};

HvSpinner.namespaceURI = Namespaces.HYPERVIEW;
HvSpinner.localName = LOCAL_NAME.SPINNER;

export default HvSpinner;
