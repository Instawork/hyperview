import * as Namespaces from 'hyperview/src/services/namespaces';
import { ActivityIndicator } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import React from 'react';
import { createTestProps } from 'hyperview/src/services';

const HvSpinner = (props: HvComponentProps) => {
  const color = props.element.getAttribute('color') || '#8d9494';
  const { testID, accessibilityLabel } = createTestProps(props.element);

  return (
    <ActivityIndicator
      accessibilityLabel={accessibilityLabel}
      color={color}
      testID={testID}
    />
  );
};

HvSpinner.namespaceURI = Namespaces.HYPERVIEW;
HvSpinner.localName = LOCAL_NAME.SPINNER;

export default HvSpinner;
