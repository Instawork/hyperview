/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Context, PureComponent } from 'react';
import { NavigationContext } from 'hyperview/src/contexts';
import { Parser } from 'hyperview/src/services/dom';
import { Props } from 'hyperview/src/core/components/hv-navigator/types';

type State = {};

export default class HvRoute extends PureComponent<
  Props,
  State,
  NavigationContext
> {
  static contextType = NavigationContext;
  // declare context: React.ContextType<typeof NavigationContext>;

  static defaultProps = {};

  parser: Parser;

  constructor(props: Props) {
    super(props);
    this.parser = new Parser(
      this.context.fetch,
      this.context.onParseBefore,
      this.context.onParseAfter,
    );
  }

  someThing = () => {
    const { navigation } = this.context;
  };
}

// HvRoute.contextType = NavigationContext;
