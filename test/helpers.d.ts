/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Element, HvComponent } from 'hyperview/src/types';
export declare const getElements: (xml: string, localName: LocalName, namespaceURI?: string) => Element[];
export declare const getDummyHvProps: () => {
    onUpdate: () => void;
    options: {};
    stylesheets: {
        focused: never[];
        pressed: never[];
        pressedSelected: never[];
        regular: never[];
        selected: never[];
    };
};
export declare const parse: (template: string) => any;
export declare const render: (Component: HvComponent, template: string, ComponentsRegistry?: HvComponent[] | null) => HvComponent | null | undefined;
