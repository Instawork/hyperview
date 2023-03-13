/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * The elements in the Document with the given ids will be set to
 * visible or hidden based on showIndicators.
 * Returns a new Document object with the toggled indicators.
 */
export declare const toggleIndicators: (ids: Array<string>, showIndicators: boolean, root: Document) => Document;
/**
 * Returns a new Document object that shows the "show" indicators
 * and hides the "hide" indicators.
 */
export declare const setIndicatorsBeforeLoad: (showIndicatorIds: Array<string>, hideIndicatorIds: Array<string>, root: Document) => Document;
/**
 * Returns a new Document object that hides the "show" indicators
 * and shows the "hide" indicators.
 */
export declare const setIndicatorsAfterLoad: (showIndicatorIds: Array<string>, hideIndicatorIds: Array<string>, root: Document) => Document;
/**
 * Returns a new Document object where the given action was applied to the target element
 * with the new element.
 */
export declare const performUpdate: (action: UpdateAction, targetElement: Element, newElement: Element) => Document;
