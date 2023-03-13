/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DOMString, HvComponentProps } from 'hyperview/src/types';
import { PureComponent } from 'react';
export default class HvSelectMultiple extends PureComponent<HvComponentProps> {
    static namespaceURI: any;
    static localName: any;
    static localNameAliases: never[];
    static getFormInputValues: (element: Element) => Array<[string, string]>;
    constructor(props: HvComponentProps);
    /**
     * Callback passed to children. Option components invoke this callback when toggles.
     * Will update the XML DOM to toggle the option with the given value.
     */
    onToggle: (selectedValue?: DOMString | null) => void;
    render(): any;
}
