import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FactoryInfo extends Component {
  static propTypes = {
    item: PropTypes.object,
    rightDrawer: PropTypes.func,
  };

  render() {
    return (
      <div style={{ width: 500 }}>
        <h1>{this.props.item.name || 'Hello'}</h1>
      </div>
    );
  }
}
