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

type BuildScreenProps = {
  url: string | null;
  navLogic: Navigator.Logic;
  routeProps: InnerRouteProps;
};

type RouteRenderProps = {
  doc: Document;
  element?: Element;
  navLogic: Navigator.Logic;
  routeProps: InnerRouteProps;
  url: string;
};

/**
 * Build the <HvScreen> component with injected props
 */
const BuildHvScreen = (props: BuildScreenProps): React.ReactElement => {
  // Inject the corrected url into the params
  const routeProps = {
    ...props.routeProps,
    route: {
      ...props.routeProps.route,
      params: { ...props.routeProps.route?.params, url: props.url },
    },
  };

  return (
    <DateFormatContext.Consumer>
      {formatter => (
        <HvScreen
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...routeProps}
          back={props.navLogic.back}
          behaviors={routeProps.behaviors}
          closeModal={props.navLogic.closeModal}
          components={routeProps.components}
          elementErrorComponent={routeProps.elementErrorComponent}
          entrypointUrl={props.url || routeProps.entrypointUrl}
          errorScreen={routeProps.errorScreen}
          fetch={routeProps.fetch}
          formatDate={formatter}
          loadingScreen={routeProps.loadingScreen}
          navigate={props.navLogic.navigate}
          navigation={routeProps.navigation}
          onParseAfter={routeProps.onParseAfter}
          onParseBefore={routeProps.onParseBefore}
          openModal={props.navLogic.openModal}
          push={props.navLogic.push}
          // refreshControl={props.refreshControl}
          route={routeProps.route}
        />
      )}
    </DateFormatContext.Consumer>
  );
};

export const RouteRender = (props: RouteRenderProps): React.ReactElement => {
  let renderElement: Element | null = null;

  if (props.element) {
    renderElement = props.element;
  } else {
    // Get the <doc> element
    const root: Element | null = getFirstTag(props.doc, LOCAL_NAME.DOC);
    if (!root) {
      throw new Errors.HvRenderError('No root element found');
    }

    // Get the first child as <screen> or <navigator>
    const screenElement: Element | null = getFirstTag(root, LOCAL_NAME.SCREEN);
    const navigatorElement: Element | null = getFirstTag(
      root,
      LOCAL_NAME.NAVIGATOR,
    );

    if (!screenElement && !navigatorElement) {
      throw new Errors.HvRenderError(
        'No <screen> or <navigator> element found',
      );
    }
    renderElement = screenElement || navigatorElement;
  }

  if (!renderElement) {
    throw new Errors.HvRenderError('No element found');
  }

  if (renderElement.namespaceURI !== Namespaces.HYPERVIEW) {
    throw new Errors.HvRenderError('Invalid namespace');
  }

  switch (renderElement.localName) {
    case LOCAL_NAME.SCREEN:
      if (props.routeProps.handleBack) {
        return (
          <props.routeProps.handleBack>
            <BuildHvScreen
              navLogic={props.navLogic}
              routeProps={props.routeProps}
              url={props.url}
            />
          </props.routeProps.handleBack>
        );
      }
      return (
        <BuildHvScreen
          navLogic={props.navLogic}
          routeProps={props.routeProps}
          url={props.url}
        />
      );
    case LOCAL_NAME.NAVIGATOR:
      return <HvNavigator element={renderElement} />;
    default:
      throw new Errors.HvRenderError('Invalid element type');
  }
};
