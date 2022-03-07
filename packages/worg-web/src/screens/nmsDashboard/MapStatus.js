import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, GET_ONE } from 'ra-loopback3';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import config from '../../Config';
import MapDmaStatus from './MapDmaStatus';
import MapFlowLoggerStatus from './MapFlowLoggerStatus';
import { KmlView } from 'web-common';

class MapStatus extends Component {
  refMap = React.createRef();
  state = { flgShowInfo: false };
  componentDidMount() {
    this.getDefaultZoom();
  }
  getDefaultZoom = () => {
    this.props.dataProvider(GET_ONE, 'nmsconfigs', { id: 'MapDefaultZoom' }).then(res => {
      // console.log('get default zoom', res.data);
      if (res && res.data && res.data.value >= config.ZOOM_LIMIT_TO_SHOW_TEXT_MARKER) {
        this.setState({ flgShowInfo: true });
      }
    });
  };
  getStatus = data => {
    if (data.timeStatus != 'ok') {
      return data.timeStatus;
    }
    return data.status;
  };
  handleZoomChanged = () => {
    let zoom = this.refMap.current.getZoom();
    // console.log('handleZoomChanged', zoom);
    if (zoom && zoom >= config.ZOOM_LIMIT_TO_SHOW_TEXT_MARKER) {
      this.setState({ flgShowInfo: true });
    } else {
      this.setState({ flgShowInfo: false });
    }
  };

  render() {
    const { flgShowInfo } = this.state;
    const { currentStatus, baseOnFlowLogger, theme } = this.props;
    return (
      <MapRenderWithConfig
        refMap={this.refMap}
        options={{ minHeight: '700px', height: 'auto' }}
        onZoomChanged={this.handleZoomChanged}
      >
        <KmlView types={['Pipe']} common="all" />
        {baseOnFlowLogger ? (
          <MapFlowLoggerStatus
            flgShowInfo={flgShowInfo}
            theme={theme}
            getStatus={this.getStatus}
            currentStatus={currentStatus}
          />
        ) : (
          <MapDmaStatus theme={theme} getStatus={this.getStatus} currentStatus={currentStatus} />
        )}
      </MapRenderWithConfig>
    );
  }
}
MapStatus.propTypes = {
  dataProvider: PropTypes.func,
  currentStatus: PropTypes.array,
  baseOnFlowLogger: PropTypes.bool,
  theme: PropTypes.object.isRequired,
};
const enhance = compose(withDataProvider);
export default enhance(MapStatus);
