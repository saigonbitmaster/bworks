import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CUSTOM } from 'ra-loopback3';
import WaterSourceMarker from './WaterSourceMarker';

export default class MapWaterSource extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
  };
  state = {
    waterSources: [],
    factories: [],
  };

  componentDidMount() {
    const { dataProvider } = this.props;
    dataProvider(CUSTOM, 'watersources', {}).then(res => {
      if (res && res.data && res.data.length) {
        this.setState({
          waterSources: res.data,
        });
      } else {
        this.setState({
          waterSources: [],
        });
      }
    });
    dataProvider(CUSTOM, 'factories', {}).then(res => {
      if (res && res.data && res.data.length) {
        this.setState({
          factories: res.data,
        });
      } else {
        this.setState({
          factories: [],
        });
      }
    });
  }
  render() {
    const { waterSources, factories } = this.state;
    return (
      <Fragment>
        {waterSources.map(item => (
          <WaterSourceMarker
            key={item.id}
            info={item}
            status={{ name: 'critical', speed: '0s', color: 'white' }}
            type="WaterSource"
          />
        ))}
        {factories.map(item => (
          <WaterSourceMarker
            key={item.id}
            info={item}
            status={{ name: 'normal', speed: '0s', color: 'white' }}
            type="Factory"
          />
        ))}
      </Fragment>
    );
  }
}
