import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GisRightSide extends Component {
  static propTypes = {
    children: PropTypes.any,
  };

  render() {
    const { children } = this.props;
    return <div style={{ flex: 4, backgroundColor: 'grey' }}>{children}</div>;
  }
}
