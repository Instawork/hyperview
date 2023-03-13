/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { Props, State } from './types';
import { PureComponent } from 'react';
/**
 * Component that handles dispatching behaviors based on the appropriate
 * triggers.
 */
export default class HyperRef extends PureComponent<Props, State> {
    props: Props;
    state: State;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    onEventDispatch: (eventName: string) => void;
    createActionHandler: (element: Element, behaviorElement: Element, onUpdate: HvComponentOnUpdate) => () => void;
    triggerLoadBehaviors: () => void;
    render(): any;
}
export declare const addHref: (component: any, element: Element, stylesheets: StyleSheets, onUpdate: HvComponentOnUpdate, options: HvComponentOptions) => any;
