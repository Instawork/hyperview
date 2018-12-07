import React, { PureComponent } from 'react';
import Hyperview from 'hyperview';

export default class HyperviewScreen extends React.PureComponent {
  goBack = (params, key) => {
    console.log('GO BACK');
    console.log(params, key);
    this.props.navigation.pop();
  }

  closeModal = (params, key) => {
    console.log('CLOSE MODAL');
    console.log(params, key);
    this.props.navigation.pop();
  }

  push = (params, key) => {
    // If we're in a modal stack, push the next screen on the modal stack.
    // If we're in the main stack, push the next screen in the main stack.
    // Modal stacks will have modal param set.
    const modal = this.props.navigation.getParam('modal', false);
    this.props.navigation.push(
      modal ? 'ModalStack' : 'MainStack',
      {
        modal,
        ...params,
      }
    );
  }

  navigate = (params, key) => {
    this.props.navigation.navigate({ routeName: 'MainStack', params, key });
  }

  openModal = (params, key) => {
    this.props.navigation.push('Modal', params);
  }

  fetchWrapper = (input, init = { headers: {} }) => {
    return fetch(input, {
      ...init,
      headers: {
        ...init.headers,

        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
      }
    });
  }

  render() {
    const navigation = this.props.navigation;
    const entrypointUrl = navigation.state.params.url;

    return (
      <Hyperview
        back={this.goBack}
        closeModal={this.closeModal}
        entrypointUrl={entrypointUrl}
        fetch={this.fetchWrapper}
        navigate={this.navigate}
        navigation={navigation}
        openModal={this.openModal}
        push={this.push}
        replace={navigation.replace}
      />
    );
  }
}
