import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withDataProvider, CUSTOM, MapPipe } from 'ra-loopback3';
import WaterSourceMarker from './waterSourceMarker';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
const style = theme => ({
  options: { strokeColor: theme.pipe.edit },
});
@withDataProvider
class MapWaterSource extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
  };
  state = {
    waterSources: [],
    currentStatus: [],
    pipes: [],
    factories: [],
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
    this.getPipe();
    this.getFactory();
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
  getPipe = () => {
    const { dataProvider } = this.props;
    dataProvider(CUSTOM, 'pipes', {}).then(res => {
      if (res && res.data && res.data.length) {
        this.setState({
          pipes: res.data,
        });
      } else {
        this.setState({
          pipes: [],
        });
      }
    });
  };
  getFactory = () => {
    const { dataProvider } = this.props;
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
  };
  render() {
    const { waterSources, currentStatus, pipes, factories } = this.state;
    return (
      <Fragment>
        {waterSources.map(waterSource => (
          <WaterSourceMarker
            key={waterSource.name}
            watersource={waterSource}
            status={this.waterSourceStatus(waterSource.id, currentStatus)}
            type="WaterSource"
          />
        ))}
        {pipes.length &&
          pipes.map(item => {
            return (
              <MapPipe
                key={item.id}
                path={item.polyline}
                options={{
                  strokeColor: '#f44336',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#f44336',
                  fillOpacity: 0.35,
                  zIndex: 100,
                }}
              />
            );
          })}
        {factories.map(item => (
          <WaterSourceMarker
            key={item.id}
            watersource={item}
            status={{ name: 'normal', speed: '0s', color: 'white' }}
            type="Factory"
          />
        ))}
      </Fragment>
    );
  }
}
const enhance = compose(withDataProvider, withStyles(style));
export default enhance(MapWaterSource);