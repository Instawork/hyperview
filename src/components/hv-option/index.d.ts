/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { PureComponent } from 'react';
import type { HvComponentProps } from 'hyperview/src/types';
import type { State } from './types';
/**
 * A component representing an option in a single-select or multiple-select list.
 * Has a local pressed state. The selected state is read from the element attribute.
 */
export default class HvOption extends PureComponent<HvComponentProps, State> {
    static namespaceURI: any;
    static localName: any;
    static localNameAliases: never[];
    props: HvComponentProps;
    state: State;
    componentDidUpdate(prevProps: HvComponentProps): void;
    triggerSelectBehaviors: () => void;
    triggerDeselectBehaviors: () => void;
    render(): any;
}
