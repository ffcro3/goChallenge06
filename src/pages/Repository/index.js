/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import PropTypes from 'prop-types';

export default class Repository extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const {navigation} = this.props;
    const repo = navigation.getParam('repository');
    return (
      <>
        <WebView onLoad={this.pageLoaded} source={{uri: repo.html_url}} />
      </>
    );
  }
}
