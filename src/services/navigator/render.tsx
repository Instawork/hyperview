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
  Document,
  Element,
  LOCAL_NAME,
} from 'hyperview/src/services/navigator/types';
import { DateFormatContext } from 'hyperview/src/contexts/navigation';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import { InnerRouteProps } from 'hyperview/src/core/components/hv-route/types';
import React from 'react';
import { getFirstTag } from 'hyperview/src/services/navigator/helpers';

/**
 * Build the <HvScreen> component with injected props
 */
const BuildHvScreen = (props: {
  url: string | null;
  navLogic: Navigator.Logic;
  routeProps: InnerRouteProps;
}): React.ReactElement => {
  return (
    <DateFormatContext.Consumer>
      {formatter => (
        <HvScreen
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props.routeProps}
          back={props.navLogic.back}
          behaviors={props.routeProps.behaviors}
          closeModal={props.navLogic.closeModal}
          components={props.routeProps.components}
          elementErrorComponent={props.routeProps.elementErrorComponent}
          entrypointUrl={props.url || props.routeProps.entrypointUrl}
          errorScreen={props.routeProps.errorScreen}
          fetch={props.routeProps.fetch}
          formatDate={formatter}
          loadingScreen={props.routeProps.loadingScreen}
          navigate={props.navLogic.navigate}
          navigation={props.routeProps.navigation}
          onParseAfter={props.routeProps.onParseAfter}
          onParseBefore={props.routeProps.onParseBefore}
          openModal={props.navLogic.openModal}
          push={props.navLogic.push}
          // refreshControl={props.refreshControl}
          route={props.routeProps.route}
        />
      )}
    </DateFormatContext.Consumer>
  );
};

export const RouteRender = (props: {
  navLogic: Navigator.Logic;
  routeProps: InnerRouteProps;
  doc: Document;
  url: string;
}): React.ReactElement => {
  const { navLogic, routeProps, doc, url } = props;

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
      if (routeProps.handleBack) {
        return (
          <routeProps.handleBack>
            <BuildHvScreen
              navLogic={navLogic}
              routeProps={routeProps}
              url={url}
            />
          </routeProps.handleBack>
        );
      }
      return (
        <BuildHvScreen navLogic={navLogic} routeProps={routeProps} url={url} />
      );
    case LOCAL_NAME.NAVIGATOR:
      return <HvNavigator element={element} />;
    default:
      throw new Errors.HvRenderError('Invalid element type');
  }
};
