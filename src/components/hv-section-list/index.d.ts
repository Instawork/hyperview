/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { PureComponent } from 'react';
import { DOMParser } from 'xmldom-instawork';
import type { HvComponentProps } from 'hyperview/src/types';
import type { State } from './types';
export default class HvSectionList extends PureComponent<HvComponentProps, State> {
    static namespaceURI: any;
    static localName: any;
    static localNameAliases: never[];
    parser: DOMParser;
    props: HvComponentProps;
    state: State;
    refresh: () => void;
    render(): any;
}
