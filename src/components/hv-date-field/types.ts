/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import type {
  Element,
  HvComponentOptions,
  StyleSheet as StyleSheetType,
  StyleSheets,
} from 'hyperview/src/types';

export type FieldProps = {
  children?: React.ReactNode;
  element: Element;
  focused: boolean;
  onPress: () => void;
  options: HvComponentOptions;
  stylesheets: StyleSheets;
  value: Date | null | undefined;
};

export type FieldLabelProps = {
  focused: boolean;
  formatter: (
    value?: Date | null | undefined,
    format?: string | null | undefined,
  ) => string;
  labelFormat: string | null | undefined;
  placeholder: string | null | undefined;
  placeholderTextColor: string | null | undefined;
  pressed: boolean;
  style: StyleSheetType;
  value: Date | null | undefined;
};

export type ModalButtonProps = {
  getStyle: (pressed: boolean) => Array<StyleSheetType>;
  label: string;
  onPress: () => void;
};
