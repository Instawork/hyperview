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

    const rootNode = getRootNode(this.state.doc);
    if (!rootNode) {
      return (
        <View
          style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
        >
          <Text>ROUTE ERROR: no first node</Text>
        </View>
      );
    }

    switch (rootNode.nodeName) {
      case LOCAL_NAME.NAVIGATOR:
        return <HyperNavigator doc={rootNode} />;
      case LOCAL_NAME.SCREEN:
        return (
          <Contexts.DateFormatContext.Consumer>
            {formatter => (
              <Contexts.FetchContext.Consumer>
                {fetchContext => (
                  <Hyperview
                    fetch={fetchContext.fetch}
                    formatDate={formatter}
                    navigation={this.props.navigation}
                    // back={actions.back}
                    // closeModal={actions.close}
                    // navigate={actions.navigate}
                    // openModal={actions.openModal}
                    // push={actions.push}
                    route={this.props.route}
                    // push={this.props.navigation?.push}
                    url={rootNode.getAttribute('href')}
                  />
                )}
              </Contexts.FetchContext.Consumer>
            )}
          </Contexts.DateFormatContext.Consumer>
        );
      default:
        return (
          <View
            style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
          >
            <Text>ROUTE ERROR: UNKNOWN TYPE: {rootNode?.nodeName}</Text>
          </View>
        );
    }
  }
}

HyperviewRoute.contextType = Contexts.FetchContext;
