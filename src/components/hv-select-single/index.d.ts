/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DOMString, HvComponentProps } from 'hyperview/src/types';
import { PureComponent } from 'react';
export default class HvSelectSingle extends PureComponent<HvComponentProps> {
    static namespaceURI: any;
    static localName: any;
    static localNameAliases: never[];
    static getFormInputValues: (element: Element) => Array<[string, string]>;
    constructor(props: HvComponentProps);
    componentDidUpdate(): void;
    /**
     * Callback passed to children. Option components invoke this callback when selected.
     * SingleSelect will update the XML DOM so that only the selected option is has a
     * selected=true attribute.
     */
    onSelect: (selectedValue?: DOMString | null) => void;
    render(): any;
}
