import React, { PureComponent } from 'react';
import Hyperview from 'hyperview';

export default class HyperviewScreen extends React.PureComponent {
  goBack = (routeParams) => {
    const { navigation } = this.props;
    navigation.goBack(routeParams);
  }

  push = (params) => {
    const { navigation } = this.props;
    navigation.push('Home', params);
  }

  render() {
    const navigation = this.props.navigation;
    const entrypointUrl = 'http://10.1.10.14:8086/index.xml'; //navigation.state.params.url;

    return (
      <Hyperview
        back={this.goBack}
        closeModal={this.goBack}
        entrypointUrl={entrypointUrl}
        fetch={fetch}
        navigate={navigation.navigate}
        navigation={navigation}
        openModal={this.push}
        push={this.push}
        replace={navigation.replace}
      />
    );
  }
}
