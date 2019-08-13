// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  BehaviorRegistry,
  Document,
  Element,
  HvBehavior,
} from 'hyperview/src/types';
import HvAlert from 'hyperview/src/behaviors/hv-alert';
import HvShare from 'hyperview/src/behaviors/hv-share';
import HvToggle from 'hyperview/src/behaviors/hv-toggle';
import { shallowCloneToRoot } from 'hyperview/src/services';

const HYPERVIEW_BEHAVIORS = [HvAlert, HvShare, HvToggle];

export const getRegistry = (behaviors: HvBehavior[] = []): BehaviorRegistry =>
  [...HYPERVIEW_BEHAVIORS, ...behaviors].reduce(
    (registry, behavior) => ({
      ...registry,
      [behavior.action]: behavior,
    }),
    {},
  );

/**
 * The elements in the Document with the given ids will be set to
 * visible or hidden based on showIndicators.
 * Returns a new Document object with the toggled indicators.
 */
export const toggleIndicators = (
  ids: Array<string>,
  showIndicators: boolean,
  root: Document,
): Document =>
  ids.reduce((newRoot, id) => {
    const indicatorElement: ?Element = root.getElementById(id);
    if (!indicatorElement) {
      return newRoot;
    }
    indicatorElement.setAttribute('hide', showIndicators ? 'false' : 'true');
    return shallowCloneToRoot(indicatorElement);
  }, root);

/**
 * Returns a new Document object that shows the "show" indicators
 * and hides the "hide" indicators.
 */
export const setIndicatorsBeforeLoad = (
  showIndicatorIds: Array<string>,
  hideIndicatorIds: Array<string>,
  root: Document,
): Document => {
  let newRoot: Document = root;
  newRoot = toggleIndicators(showIndicatorIds, true, newRoot);
  newRoot = toggleIndicators(hideIndicatorIds, false, newRoot);
  return newRoot;
};

/**
 * Returns a new Document object that hides the "show" indicators
 * and shows the "hide" indicators.
 */
export const setIndicatorsAfterLoad = (
  showIndicatorIds: Array<string>,
  hideIndicatorIds: Array<string>,
  root: Document,
): Document => {
  let newRoot: Document = root;
  newRoot = toggleIndicators(showIndicatorIds, false, newRoot);
  newRoot = toggleIndicators(hideIndicatorIds, true, newRoot);
  return newRoot;
};
