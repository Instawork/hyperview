import * as Namespaces from 'hyperview/src/services/namespaces';
import React, { PureComponent } from 'react';
import { ActivityIndicator } from 'react-native';
import type { HvComponentProps } from 'hyperview/src/types';
import { LOCAL_NAME } from 'hyperview/src/types';

export default class HvSpinner extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.SPINNER;

  render() {
    const color = this.props.element.getAttribute('color') || '#8d9494';
    return <ActivityIndicator color={color} />;
  }
}
