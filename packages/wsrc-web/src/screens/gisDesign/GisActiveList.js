import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GisWaterSourceGroupList from './GisWaterSourceGroupList';

export default class GisActiveList extends Component {
  static propTypes = {
    resource: PropTypes.string,
  };

  render() {
    const { resource } = this.props;
    switch (resource) {
      case 'watersourcegroups':
        return <GisWaterSourceGroupList {...this.props} title={`resources.${resource}.name`} style={{ flex: 1 }} />;
      default:
        return null;
    }
  }
}
