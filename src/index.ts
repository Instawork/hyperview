import * as Events from 'hyperview/src/services/events';
import * as Logging from 'hyperview/src/services/logging';
import * as Namespaces from 'hyperview/src/services/namespaces';

/**
 * Root component for Hyperview.
 *
 * @see https://hyperview.dev/docs/getting-started/installation
 */
export { default } from './hyperview';

/**
 * Types for Hyperview.
 */
export type {
  DOMString,
  ExperimentalFeatures,
  HvBehavior,
  HvComponent,
  HvComponentProps,
  HvComponentOnUpdate,
  HvComponentOptions,
  HvGetRoot,
  HvUpdateRoot,
  NavigationComponents,
  RouteParams,
  RouteProps,
  StyleSheet,
  StyleSheets,
} from 'hyperview/src/types';
export { ACTIONS, LOCAL_NAME, NODE_TYPE } from 'hyperview/src/types';

/**
 * Core
 *
 * @see https://hyperview.dev/docs/getting-started/installation
 */
export { default as HvElement } from 'hyperview/src/core/components/hv-element';
export { useScrollContext } from 'hyperview/src/core/components/scroll';
export { createEventHandler } from 'hyperview/src/services';

/**
 * Services
 */
export { Events, Logging, Namespaces };
export {
  createProps,
  createStyleProp,
  createTestProps,
  getAncestorByTagName,
  shallowCloneToRoot,
} from 'hyperview/src/services';
export {
  Parser,
  getBehaviorElements,
  getFirstTag,
} from 'hyperview/src/services/dom';
export { HvBaseError } from 'hyperview/src/services/error';
export { renderChildren, renderElement } from 'hyperview/src/services/render';
export { createStylesheets } from 'hyperview/src/services/stylesheets';
export { getUrlFromHref } from 'hyperview/src/services/url';

// TODO: Legacy export
// Remove and replace with RouteProps
export type { RouteProps as Route } from 'hyperview/src/types';
