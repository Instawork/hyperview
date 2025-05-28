import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  HvComponentOnUpdate,
  HvComponentProps,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import HvChildren from 'hyperview/src/core/components/hv-children';
import { LOCAL_NAME } from 'hyperview/src/types';
import { Text } from 'react-native';
import { addHref } from 'hyperview/src/core/hyper-ref';
import { createProps } from 'hyperview/src/services';

export default class HvText extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.TEXT;

  Component = () => {
    const props = createProps(
      this.props.element,
      this.props.stylesheets,
      this.props.options,
    );
    const { key, ...rest } = props;
    return (
      <Text
        key={key}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      >
        <HvChildren
          element={this.props.element}
          onUpdate={this.props.onUpdate}
          options={{
            ...this.props.options,
            preformatted:
              this.props.element.getAttribute('preformatted') === 'true',
          }}
          stylesheets={this.props.stylesheets}
        />
      </Text>
    );
  };

  render() {
    const { Component } = this;
    const { skipHref } = this.props.options || {};

    return skipHref ? (
      <Component />
    ) : (
      addHref(
        <Component />,
        this.props.element,
        this.props.stylesheets,
        this.props.onUpdate as HvComponentOnUpdate,
        this.props.options,
      )
    );
  }
}
