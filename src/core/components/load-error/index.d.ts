/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { PureComponent } from 'react';
import type { Props } from './types';
export default class LoadError extends PureComponent<Props> {
    props: Props;
    getHTML: () => string | null | undefined;
    getTitle: () => string;
    Header: () => any;
    Error: () => any;
    render(): any;
}
