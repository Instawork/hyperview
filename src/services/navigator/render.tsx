/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Namespaces from 'hyperview/src/services/namespaces';
import {
  DateFormatContext,
  NavigationContextProps,
} from 'hyperview/src/contexts/navigation';
import {
  Document,
  Element,
  LOCAL_NAME,
} from 'hyperview/src/services/navigator/types';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import Navigator from 'hyperview/src/services/navigator';
import React from 'react';
import { getFirstTag } from 'hyperview/src/services/navigator/helpers';

/**
 * Build the <HvScreen> component with injected props
 * @param url
 * @param doc
 * @param navContext
 * @returns
 */
const BuildHvScreen = (
  url: string | null,
  doc: Document,
  navContext: NavigationContextProps | null,
  navigator: Navigator,
): React.ReactElement => {
  return (
    <DateFormatContext.Consumer>
      {formatter => (
        <HvScreen
          back={navigator.back}
          behaviors={navContext?.behaviors}
          closeModal={navigator.closeModal}
          components={navContext?.components}
          elementErrorComponent={navContext?.elementErrorComponent}
          entrypointUrl={url || navContext?.entrypointUrl}
          errorScreen={navContext?.errorScreen}
          fetch={navContext?.fetch}
          formatDate={formatter}
          loadingScreen={navContext?.loadingScreen}
          navigate={navigator.navigate}
          // navigation={props.navigation}
          onParseAfter={navContext?.onParseAfter}
          onParseBefore={navContext?.onParseBefore}
          openModal={navigator.openModal}
          push={navigator.push}
          // refreshControl={props.refreshControl}
          // route={props.route}
        />
      )}
    </DateFormatContext.Consumer>
  );
};

export const renderElement = (
  url: string | null,
  doc: Document,
  navContext: NavigationContextProps | null,
  navigator: Navigator,
): React.ReactElement => {
  // Get the <doc> element
  const root: Element | null = getFirstTag(doc, LOCAL_NAME.DOC);
  if (!root) {
    throw new Error('No root element');
  }

  // Get the first child as <screen> or <navigator>
  const screenElement: Element | null = getFirstTag(root, LOCAL_NAME.SCREEN);
  const navigatorElement: Element | null = getFirstTag(
    root,
    LOCAL_NAME.NAVIGATOR,
  );
  const element: Element | null = screenElement ?? navigatorElement;
  if (!element) {
    throw new Error('No element node');
  }

  if (element.namespaceURI !== Namespaces.HYPERVIEW) {
    throw new Error('Invalid namespace');
  }

  switch (element.localName) {
    case LOCAL_NAME.SCREEN:
      if (navContext && navContext.handleBack) {
        return (
          <navContext.handleBack>
            {BuildHvScreen(url, doc, navContext, navigator)}
          </navContext.handleBack>
        );
      }
      return BuildHvScreen(url, doc, navContext, navigator);
    case LOCAL_NAME.NAVIGATOR:
      return <HvNavigator element={element} />;
    default:
      throw new Error('Invalid element type');
  }
};
