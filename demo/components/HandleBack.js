import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { BackHandler } from "react-native";

class HandleBack extends Component {
  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", this.onBack)
    );
  }

  componentDidMount() {
    this.willBlur = this.props.navigation.addListener("willBlur", (payload) =>
      BackHandler.removeEventListener("hardwareBackPress", this.onBack)
    );
  }

  onBack = () => {
    if(this.props.navigation && this.props.navigation.goBack && !this.props.navigation.isFirstRouteInParent()){
      const { url } = this.props.navigation.state.params;
      if (url.includes("custom_android_back")) {
        this.props.navigation.popToTop(null);
        return true;
      }
    }
    return false;
  };

  componentWillUnmount() {
    this.didFocus.remove();
    this.willBlur.remove();
    BackHandler.removeEventListener("hardwareBackPress", this.onBack);
  }

  render() {
    return this.props.children;
  }
}

export default withNavigation(HandleBack);