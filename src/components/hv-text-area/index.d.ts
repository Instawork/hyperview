/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { HvComponentProps } from 'hyperview/src/types';
import { PureComponent } from 'react';
export default class HvTextArea extends PureComponent<HvComponentProps> {
    static namespaceURI: any;
    static localName: any;
    static localNameAliases: never[];
    static getFormInputValues: (element: Element) => Array<[string, string]>;
    constructor(props: HvComponentProps);
    triggerFocusBehaviors: (newElement: Element) => void;
    triggerBlurBehaviors: (newElement: Element) => void;
    triggerChangeBehaviors: (newElement: Element) => void;
    triggerBehaviors: (newElement: Element, triggerName: string) => void;
    setFocus: (focused: boolean) => void;
    render(): any;
}
