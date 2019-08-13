// @flow

import type { Document, Element } from 'hyperview/src/types';
import { shallowCloneToRoot } from 'hyperview/src/services';

/**
 * The elements in the Document with the given ids will be set to
 * visible or hidden based on showIndicators.
 * Returns a new Document object with the toggled indicators.
 */
export const toggleIndicators = (
  ids: Array<string>,
  showIndicators: boolean,
  root: Document,
): Document => {
  let newRoot = root;
  ids.forEach(id => {
    const indicatorElement: ?Element = root.getElementById(id);
    if (!indicatorElement) {
      return;
    }
    indicatorElement.setAttribute('hide', showIndicators ? 'false' : 'true');
    newRoot = shallowCloneToRoot(indicatorElement);
  });
  return newRoot;
};

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
