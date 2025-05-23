import * as Namespaces from 'hyperview/src/services/namespaces';
import {
  ChildrenContextProvider,
  useChildrenContext,
} from 'hyperview/src/core/children-context';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { PureComponent, createElement } from 'react';
import { LOCAL_NAME } from 'hyperview/src/types';
import { Text } from 'react-native';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';

export default class HvText extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.TEXT;

  Content = () => {
    const { childList: children } = useChildrenContext();
    const elementProps = createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    return createElement(Text, elementProps, ...children);
  };

  Provider = () => {
    const options = {
      ...this.props.options,
      preformatted: this.props.element.getAttribute('preformatted') === 'true',
    };

    const { Content } = this;
    return (
      <ChildrenContextProvider
        element={this.props.element}
        onUpdate={this.props.onUpdate}
        options={options}
        stylesheets={this.props.stylesheets}
      >
        <Content />
      </ChildrenContextProvider>
    );
  };

  render() {
    const { skipHref } = this.props.options || {};

    const { Provider } = this;
    return skipHref ? (
      <Provider />
    ) : (
      addHref(
        <Provider />,
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate as HvComponentOnUpdate,
        this.props.options,
      )
    );
  }
}
