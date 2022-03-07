import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LoginMapView extends Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  render() {
    return <div style={{ position: 'relative' }}>loading</div>;
  }
}

LoginMapView.defaultProps = {
  loading: true,
};
