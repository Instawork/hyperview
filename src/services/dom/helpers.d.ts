/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare const getBehaviorElements: (element: any) => unknown[];
export declare const getFirstTag: (document: Document, localName: LocalName, namespace?: NamespaceURI) => any;
export declare const triggerBehaviors: (targetElement: Element, triggerName: string, onUpdate: HvComponentOnUpdate) => void;
