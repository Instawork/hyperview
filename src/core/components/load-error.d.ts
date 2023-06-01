/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

type Props = {
  back: () => void;
  error: unknown;
  onPressReload: () => void;
  onPressViewDetails: (uri: string) => void;
};

export default class LoadError extends React.PureComponent<Props> {
  new(props: Props); // eslint-disable-line instawork/component-methods-use-arrows
}
