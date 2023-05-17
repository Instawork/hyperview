/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import { getNode } from 'hyperview/src/services/navigator/helpers';
import {
  Document,
  LOCAL_NAME,
  Node,
} from 'hyperview/src/services/navigator/types';
import { Text, View } from 'react-native';
import { Props } from 'hyperview/src/core/components/hv-route';
import { NavigationContextProps } from 'hyperview/src/contexts/navigation';
import React from 'react';

export const renderElement = (
  doc: Document,
  contextValue: NavigationContextProps | null,
  props: Props,
): React.ReactElement => {
  // Get the <doc> element
  const root: Node | undefined = getNode(doc);
  if (!root) {
    throw new Error('No root node');
  }

  // Get the first child as <screen> or <navigator>
  const element: Node | undefined = getNode(root);
  if (!element) {
    throw new Error('No element node');
  }

  if (element.namespaceURI !== Namespaces.HYPERVIEW) {
    throw new Error('Invalid namespace');
  }

  switch (element.localName) {
    case LOCAL_NAME.SCREEN:
      if (!props.navigation) {
        throw new Error('Navigation is required for screen');
      }
      return (
        // <contextValue?.handleBack?>
        <HvScreen
          back={props.back}
          behaviors={contextValue?.behaviors}
          closeModal={props.closeModal}
          components={contextValue?.components}
          elementErrorComponent={contextValue?.elementErrorComponent}
          entrypointUrl={contextValue?.entrypointUrl}
          errorScreen={contextValue?.errorScreen}
          fetch={contextValue?.fetch || props.fetch}
          formatDate={props.formatDate}
          loadingScreen={contextValue?.loadingScreen}
          navigate={props.navigate}
          navigation={props.navigation}
          onParseAfter={contextValue?.onParseAfter}
          onParseBefore={contextValue?.onParseBefore}
          openModal={props.openModal}
          push={props.push}
          refreshControl={props.refreshControl}
          route={props.route}
        />
        // </contextValue?.handleBack>
      );
    case LOCAL_NAME.NAVIGATOR:
    default:
      throw new Error('Invalid element type');
  }
};
