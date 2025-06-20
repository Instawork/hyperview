import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { createTestProps } from 'hyperview/src/services';

const HvSpinner = (props: HvComponentProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { element } = props;

  const color = useMemo(() => element.getAttribute('color') || '#8d9494', [
    element,
  ]);
  const { testID, accessibilityLabel } = createTestProps(element);

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
