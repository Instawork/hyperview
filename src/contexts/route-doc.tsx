/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as TypesLegacy from 'hyperview/src/types-legacy';
import { createContext } from 'react';

export type RouteDocContextProps = {
  doc?: TypesLegacy.Document;
};

export const Context = createContext<TypesLegacy.Document | undefined>(
  undefined,
);
