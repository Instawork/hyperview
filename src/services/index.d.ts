/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Element, HvComponent, StyleSheet } from 'hyperview/src/types';
/**
 * This file is currently a dumping place for every functions used accross
 * various Hyperview components.
 */
export declare const createStyleProp: (element: Element, stylesheets: StyleSheets, options: HvComponentOptions) => Array<StyleSheet>;
/**
 * Sets the element's id attribute as a test id and accessibility label
 * (for testing automation purposes).
 */
export declare const createTestProps: (element: Element) => {
    testID?: string;
    accessibilityLabel?: string;
};
export declare const createProps: (element: Element, stylesheets: StyleSheets, options: HvComponentOptions) => Record<string, any>;
export declare const later: (delayMs: number) => Promise<void>;
/**
 * Clones the element and moves all children from the original element
 * to the clone. The returned element will be a new object, but all of the child
 * nodes will be existing objects.
 */
export declare const shallowClone: (element: Element) => Element;
/**
 * Clones all elements from the given element up to the root of the DOM.
 * Returns the new root object. Essentially, this produces a new DOM object
 * that re-uses as many existing nodes as possible.
 */
export declare const shallowCloneToRoot: (element: Element) => Document;
/**
 * Returns the element with the given timeout id.
 * Note this is different from the element's regular id, this is
 * used for tracking delayed behaviors.
 */
export declare const getElementByTimeoutId: (doc: Document, id: string) => Element | null | undefined;
/**
 * Sets a timeout id on the given element.
 */
export declare const setTimeoutId: (element: Element, id: string) => void;
/**
 * Removed the timeout id from the given element.
 */
export declare const removeTimeoutId: (element: Element) => void;
/**
 * Searches the parent chain from the given element until it finds an
 * element with the given tag name. If no ancestor with the tagName is found,
 * returns null.
 */
export declare const getAncestorByTagName: (element: Element, tagName: string) => Element | null | undefined;
export declare const flattenRegistry: (registry: ComponentRegistry) => Array<[string, string, HvComponent]>;
/**
 * Creates a FormData object for the given element. Finds the closest form element ancestor
 * and adds data for all inputs contained in the form. Returns null if the element has no
 * form ancestor, or if there is no form data to send.
 * If the given element is a form element, its form data will be returned.
 */
export declare const getFormData: (element: Element, formComponents: ComponentRegistry) => FormData | null | undefined;
export declare const getNameValueFormInputValues: (element: Element) => Array<[string, string]>;
export declare const encodeXml: (xml: string) => string;
