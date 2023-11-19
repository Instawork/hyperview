import * as NavigatorHelpers from 'hyperview/src/services/navigator/helpers';
import * as Types from './types';
import { ID_CARD, ID_MODAL } from 'hyperview/src/services/navigator/types';
import { LOCAL_NAME } from 'hyperview/src/types';
import { StackNavigationState } from '@react-navigation/native';

// TODO: Replace this with the Route type from `hyperview/src/types`
type Route = {
  key: string;
  name: string;
  params?: {
    id?: string;
    url?: string;
  };
};

export const buildRoutesFromDom = (
  doc: Document | undefined,
  state: StackNavigationState<Types.ParamListBase>,
  navigatorId: string,
  routeParamList: Record<string, object | undefined>,
  entrypointUrl: string | undefined,
): Route[] => {
  const element = doc
    ? NavigatorHelpers.getNavigatorById(doc, navigatorId)
    : null;
  const elementRoutes = element
    ? NavigatorHelpers.getChildElements(element).filter(
        e => e.localName === LOCAL_NAME.NAV_ROUTE,
      )
    : [];

  const routes: Route[] = [];
  const routeIds = state.routes.map((r: Route) => r.params?.id);
  const routeHrefs = state.routes.map((r: Route) => {
    return r.params?.url
      ? NavigatorHelpers.getUrlFromHref(r.params.url, entrypointUrl)
      : undefined;
  });

  let sequenceBroken = false;
  for (let i = 0; i < elementRoutes.length; i += 1) {
    const routeElement = elementRoutes[i];
    const href = routeElement.getAttribute('href');
    const id = routeElement.getAttribute('id');
    const isModal = routeElement.getAttribute('modal') === 'true';
    if (id) {
      const existingIndex = href
        ? routeHrefs.indexOf(
            NavigatorHelpers.getUrlFromHref(href, entrypointUrl),
          )
        : routeIds.indexOf(id);
      // Ensure each existing route is in the same order and hasn't been disrupted
      if (!sequenceBroken && existingIndex !== i) {
        sequenceBroken = true;
      }
      if (
        existingIndex > -1 &&
        !sequenceBroken &&
        // Ensure the presentation matches for dynamic screens
        (!NavigatorHelpers.isDynamicRoute(state.routes[existingIndex].name) ||
          (isModal
            ? state.routes[existingIndex].name === ID_MODAL
            : state.routes[existingIndex].name === ID_CARD))
      ) {
        routes.push(state.routes[existingIndex]);
      } else {
        const params = routeParamList[id] || {};
        routes.push({
          key: id,
          name: id,
          params,
        });
      }
    }
  }
  return routes;
};
