// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Contexts from 'hyperview/src/contexts';
import * as Dom from 'hyperview/src/services/dom';
import { ActivityIndicator, Text, View } from 'react-native';
import React, { PureComponent } from 'react';
import { getProp, getRootNode } from 'hyperview/src/navigator-helpers';
import HyperNavigator from 'hyperview/src/hv-nav-navigator';
import Hyperview from 'hyperview';
import { LOCAL_NAME } from 'hyperview/src/types';

/**
 * HyperviewRoute provides logic to process a <screen> or <navigator> element as the first child of a <doc> element.
 * Props:
 * - url or entrypointUrl: the url of the document to load
 */
export default class HyperviewRoute extends PureComponent {
  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const url =
        getProp(this.props, 'entrypointUrl') || getProp(this.props, 'url');

      this.parser = new Dom.Parser(
        this.context.fetch,
        this.context.onParseBefore,
        this.context.onParseAfter,
      );
      const { doc } = await this.parser.loadDocument(url);
      this.setState({
        doc,
        error: null,
      });
    } catch (err) {
      this.setState({
        doc: null,
        error: err,
      });
    }
  };

  render() {
    if (!this.state || (!this.state.doc && !this.state.error)) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <Text>ROUTE WAITING</Text>
          <ActivityIndicator />
        </View>
      );
    }
    if (this.state.error) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <Text>ROUTE ERROR: {this.state.error.message ?? this.state.url}</Text>
        </View>
      );
    }

    const firstNode = getRootNode(this.state.doc);
    if (!firstNode) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <Text>ROUTE ERROR: no first node</Text>
        </View>
      );
    }

    switch (firstNode.nodeName) {
      case LOCAL_NAME.NAVIGATOR:
        return <HyperNavigator doc={firstNode} />;
      case LOCAL_NAME.SCREEN:
        return (
          <Contexts.DateFormatContext.Consumer>
            {formatter => (
              <Hyperview
                entrypointUrl={firstNode.getAttribute('href')}
                fetch={this.context.fetch}
                formatDate={formatter}
                // back={actions.back}
                // closeModal={actions.close}
                // navigate={actions.navigate}
                // openModal={actions.openModal}
                // push={actions.push}
                navigation={this.props.navigation}
                // push={this.props.navigation?.push}
                route={this.props.route}
              />
            )}
          </Contexts.DateFormatContext.Consumer>
        );
      default:
        return (
          <View
            style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
          >
            <Text>ROUTE ERROR: UNKNOWN TYPE: {firstNode?.nodeName}</Text>
          </View>
        );
    }
  }
}

HyperviewRoute.contextType = Contexts.FetchContext;
