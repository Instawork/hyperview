import * as Dom from 'hyperview/src/services/dom';
import Hyperview from 'hyperview';
import HyperNavigator from 'hyperview/src/hv-nav-navigator';
import NavContext from './hv-nav-context';
import { getProp, getRootNode } from 'hyperview/src/navigator-helpers';
import { LOCAL_NAME } from 'hyperview/src/types';

import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

/**
 * HyperviewRoute provides logic to process a <screen> or <navigator> element as the first child of a <doc> element.
 * Props:
 * - url: the url of the document to load
 * - fetch: the fetch function to use to load the document
 * - onParseBefore: a function to call before parsing the document
 * - onParseAfter: a function to call after parsing the document
 * - formatDate: a function to format dates
 */
export default class HyperviewRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextType = NavContext;

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const url =
        getProp(this.props, 'entrypointUrl') || getProp(this.props, 'url');
      const fetch = getProp(this.props, 'fetch', this.context);
      const onParseBefore = getProp(this.props, 'onParseBefore', this.context);
      const onParseAfter = getProp(this.props, 'onParseAfter', this.context);
      const formatDate = getProp(this.props, 'formatDate', this.context);

      // console.log('route', this.context?.parent?.state?.id);
      // TODO
      // back={this.goBack}
      // closeModal={this.closeModal}
      // entrypointUrl={entrypointUrl}
      // fetch={this.fetchWrapper}
      // formatDate={this.formatDate}
      // navigate={this.navigate}
      // navigation={this.props.navigation}
      // openModal={this.openModal}
      // push={this.push}
      // route={this.props.route}

      this.parser = new Dom.Parser(fetch, onParseBefore, onParseAfter);
      const { doc, staleHeaderType } = await this.parser.loadDocument(url);

      const firstNode = getRootNode(doc);
      // console.log(
      //   'firstNode',
      //   firstNode.nodeName,
      //   firstNode.getAttribute('id'),
      //   firstNode.getAttribute('type'),
      // );

      this.setState({
        url,
        fetch,
        onParseBefore,
        onParseAfter,
        formatDate,
        doc,
        firstNode,
        error: null,
      });
    } catch (err) {
      this.setState({
        url: null,
        fetch: null,
        onParseBefore: null,
        onParseAfter: null,
        formatDate: null,
        doc: null,
        firstNode: null,
        error: err,
      });
    }
  };

  render() {
    if (!this.state || !this.state.doc) {
      return (
        <View>
          <Text>RT WAITING</Text>
          <ActivityIndicator />
        </View>
      );
    } else if (this.state?.error) {
      return (
        <View>
          <Text>RT ERROR:{this.state?.error ?? this.state.url}</Text>
        </View>
      );
    }

    if (!this.state?.firstNode) {
      return (
        <View>
          <Text>RT NO FIRST NODE</Text>
        </View>
      );
    }

    const firstNode = this.state.firstNode;
    switch (firstNode.nodeName) {
      case LOCAL_NAME.NAVIGATOR:
        return (
          <HyperNavigator
            fetch={this.state.fetch}
            formatDate={this.state.formatDate}
            doc={firstNode}
          />
        );
      case LOCAL_NAME.SCREEN:
        return (
          <View>
            <Text>SCREEN</Text>
            {/* TODO */}
            {/* <Hyperview
              back={this.goBack}
              closeModal={this.closeModal}
              entrypointUrl={entrypointUrl}
              fetch={this.fetchWrapper}
              formatDate={this.formatDate}
              navigate={this.navigate}
              navigation={this.props.navigation}
              openModal={this.openModal}
              push={this.push}
              route={this.props.route}
            /> */}
          </View>
        );
      default:
        return (
          <View>
            <Text>HyperviewRoute UNKNOWN TYPE: {firstNode?.nodeName}</Text>
          </View>
        );
    }
  }
}
