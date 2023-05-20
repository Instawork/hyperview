/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Errors from 'hyperview/src/services/navigator/errors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Navigator from 'hyperview/src/services/navigator';

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
import { Props } from 'hyperview/src/core/components/hv-route/types';
import React from 'react';
import { getFirstTag } from 'hyperview/src/services/navigator/helpers';

/**
 * Props used for the build screen
 */
type ScreenProps = {
  url: string | null;
  context: NavigationContextProps | null;
  navigator: Navigator.Logic;
  routeProps: Props;
};

/**
 * Build the <HvScreen> component with injected props
 * @param url
 * @param doc
 * @param context
 * @returns
 */
const BuildHvScreen = (props: ScreenProps): React.ReactElement => {
  return (
    <DateFormatContext.Consumer>
      {formatter => (
        <HvScreen
          back={props.navigator.back}
          behaviors={props.context?.behaviors}
          closeModal={props.navigator.closeModal}
          components={props.context?.components}
          elementErrorComponent={props.context?.elementErrorComponent}
          entrypointUrl={props.url || props.context?.entrypointUrl}
          errorScreen={props.context?.errorScreen}
          fetch={props.context?.fetch}
          formatDate={formatter}
          loadingScreen={props.context?.loadingScreen}
          navigate={props.navigator.navigate}
          navigation={props.routeProps.navigation}
          onParseAfter={props.context?.onParseAfter}
          onParseBefore={props.context?.onParseBefore}
          openModal={props.navigator.openModal}
          push={props.navigator.push}
          // refreshControl={props.refreshControl}
          route={props.routeProps.route}
        />
      )}
    </DateFormatContext.Consumer>
  );
};

export const renderElement = (
  url: string,
  doc: Document,
  context: NavigationContextProps,
  navigator: Navigator.Logic,
  props: Props,
): React.ReactElement => {
  // Get the <doc> element
  const root: Element | null = getFirstTag(doc, LOCAL_NAME.DOC);
  if (!root) {
    throw new Errors.HvRenderError('No root element found');
  }

  // Get the first child as <screen> or <navigator>
  const screenElement: Element | null = getFirstTag(root, LOCAL_NAME.SCREEN);
  const navigatorElement: Element | null = getFirstTag(
    root,
    LOCAL_NAME.NAVIGATOR,
  );
  const element: Element | null = screenElement ?? navigatorElement;
  if (!element) {
    throw new Errors.HvRenderError('No <screen> or <navigator> element found');
  }

  if (element.namespaceURI !== Namespaces.HYPERVIEW) {
    throw new Errors.HvRenderError('Invalid namespace');
  }

  switch (element.localName) {
    case LOCAL_NAME.SCREEN:
      if (context && context.handleBack) {
        return (
          <context.handleBack>
            <BuildHvScreen
              context={context}
              navigator={navigator}
              routeProps={props}
              url={url}
            />
          </context.handleBack>
        );
      }
      return (
        <BuildHvScreen
          context={context}
          navigator={navigator}
          routeProps={props}
          url={url}
        />
      );
    case LOCAL_NAME.NAVIGATOR:
      return <HvNavigator element={element} />;
    default:
      throw new Errors.HvRenderError('Invalid element type');
  }
};
