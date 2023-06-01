/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from 'hyperview/src/contexts';
import * as Helpers from 'hyperview/src/services/dom/helpers-legacy';
import * as HvRoute from 'hyperview/src/core/components/hv-route';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as NavigatorService from 'hyperview/src/services/navigator';
import * as TypesLegacy from 'hyperview/src/types-legacy';
import HvNavigator from 'hyperview/src/core/components/hv-navigator';
import HvScreen from 'hyperview/src/core/components/hv-screen';
import React from 'react';
import { RouteProps } from 'hyperview/src/core/components/hv-screen/types';

type BuildScreenProps = {
  doc: TypesLegacy.Document;
  navLogic: NavigatorService.Navigator;
  routeProps: HvRoute.InnerRouteProps;
  url: string | null;
};

type RouteRenderProps = {
  doc: TypesLegacy.Document;
  element?: TypesLegacy.Element;
  navLogic: NavigatorService.Navigator;
  routeProps: HvRoute.InnerRouteProps;
  url: string;
};

/**
 * Build the <HvScreen> component with injected props
 */
const Screen = (props: BuildScreenProps): React.ReactElement => {
  // Inject the corrected url into the params and cast as correct type
  const route: RouteProps = {
    ...props.routeProps.route,
    key: props.routeProps.route?.key || 'hv-screen',
    name: props.routeProps.route?.name || 'hv-screen',
    params: { ...props.routeProps.route?.params, url: props.url || undefined },
  };

  return (
    <Contexts.DateFormatContext.Consumer>
      {formatter => (
        <HvScreen
          back={props.navLogic.back}
          behaviors={props.routeProps.behaviors}
          closeModal={props.navLogic.closeModal}
          components={props.routeProps.components}
          doc={props.doc}
          elementErrorComponent={props.routeProps.elementErrorComponent}
          entrypointUrl={props.routeProps.entrypointUrl}
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
          route={route}
          url={props.url || undefined}
        />
      )}
    </Contexts.DateFormatContext.Consumer>
  );
};

export const Route = (props: RouteRenderProps): React.ReactElement => {
  let renderElement: TypesLegacy.Element | null = null;

  if (props.element) {
    renderElement = props.element;
  } else {
    // Get the <doc> element
    const root: TypesLegacy.Element | null = Helpers.getFirstTag(
      props.doc,
      TypesLegacy.LOCAL_NAME.DOC,
    );
    if (!root) {
      throw new NavigatorService.HvRenderError('No root element found');
    }

    // Get the first child as <screen> or <navigator>
    const screenElement: TypesLegacy.Element | null = Helpers.getFirstTag(
      root,
      TypesLegacy.LOCAL_NAME.SCREEN,
    );
    const navigatorElement: TypesLegacy.Element | null = Helpers.getFirstTag(
      root,
      TypesLegacy.LOCAL_NAME.NAVIGATOR,
    );

    if (!screenElement && !navigatorElement) {
      throw new NavigatorService.HvRenderError(
        'No <screen> or <navigator> element found',
      );
    }
    renderElement = screenElement || navigatorElement;
  }

  if (!renderElement) {
    throw new NavigatorService.HvRenderError('No element found');
  }

  if (renderElement.namespaceURI !== Namespaces.HYPERVIEW) {
    throw new NavigatorService.HvRenderError('Invalid namespace');
  }

  if (renderElement.localName === TypesLegacy.LOCAL_NAME.NAVIGATOR) {
    return <HvNavigator element={renderElement} />;
  }

  if (renderElement.localName === TypesLegacy.LOCAL_NAME.SCREEN) {
    if (props.routeProps.handleBack) {
      return (
        <props.routeProps.handleBack>
          <Screen
            doc={props.doc}
            navLogic={props.navLogic}
            routeProps={props.routeProps}
            url={props.url}
          />
        </props.routeProps.handleBack>
      );
    }
    return (
      <Screen
        doc={props.doc}
        navLogic={props.navLogic}
        routeProps={props.routeProps}
        url={props.url}
      />
    );
  }

  throw new NavigatorService.HvRenderError('Invalid element type');
};
