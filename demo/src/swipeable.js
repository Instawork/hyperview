import React, { PureComponent } from 'react';
import type { ElementRef } from 'react';
import { TouchableHighlight, Text } from 'react-native';
import type { HvComponentProps } from 'hyperview';
import type { HvProps } from './types';
import Hyperview from 'hyperview';
import Swipeable from 'react-native-swipeable';

const NAMESPACE_URI = 'https://hypermedia.systems/hyperview/swipeable';
const ROW = 'row';
const MAIN = 'main';
const BUTTON = 'button';

export default class SwipeableRow extends PureComponent<HvComponentProps> {
  static namespaceURI = NAMESPACE_URI;
  static localName = ROW;

  getElements = (tagName) => {
    return Array.from(this.props.element.getElementsByTagNameNS(NAMESPACE_URI, tagName));
  };

  getRendered = (tagName) => {
    const [element] = this.getElements(tagName);
    return element
      ? Hyperview.renderChildren(
          element,
          this.props.stylesheets,
          this.props.onUpdate,
          this.props.options,
        )
      : null;
  };

  getButtons = () => {
    const elements = this.getElements(BUTTON);
    if (!elements.length) {
      return null;
    }

    return elements.map((buttonElement) => {
      return Hyperview.renderChildren(buttonElement, this.props.stylesheets, this.props.onUpdate, this.props.options);
    });
  };

  render() {
    return (
      <Swipeable rightButtons={this.getButtons()}>
        {this.getRendered(MAIN)}
      </Swipeable>
    );
  }

}
