import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withDataProvider, CUSTOM } from 'ra-loopback3';
import WaterSourceMarker from './waterSourceMarker';

@withDataProvider
export default class MapWaterSource extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
  };
  state = {
    waterSources: [],
    currentStatus: [],
  };

  componentDidMount() {
    const { dataProvider } = this.props;
    dataProvider(CUSTOM, 'watersources', {}).then(res => {
      this.setState({
        waterSources: res.data,
      });
    });
    dataProvider(CUSTOM, 'WaterSources', {
      subUrl: 'dashboard',
      method: 'get',
      query: { mode: 'waterSource' },
    }).then(res => {
      if (res) {
        this.setState({ currentStatus: res.data });
      }
    });
  }
  waterSourceStatus(waterSourceId, currentStatus) {
    let status = { name: 'alert', speed: '2s', color: 'ORANGE' };
    let itemStatus = currentStatus.filter(item => item.waterSourceId == waterSourceId)[0];

    if (itemStatus) {
      if (itemStatus.alert == 1 || itemStatus.totalCritical > 0 || itemStatus.totalAlert > 1) {
        status.name = 'critical';
        status.speed = '1s';
        status.color = 'DARKGREEN';
      } else if (itemStatus.alert == 3 && itemStatus.totalAlert == 0) {
        status.name = 'normal';
        status.speed = '1s';
        status.color = 'white';
      }
    }
    return status;
  }

  render() {
    const { waterSources, currentStatus } = this.state;
    return waterSources.map(waterSource => (
      <WaterSourceMarker
        key={waterSource.name}
        watersource={waterSource}
        status={this.waterSourceStatus(waterSource.id, currentStatus)}
      />
    ));
  }
}
