import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, GET_ONE } from 'ra-loopback3';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import config from '../../Config';
import MapDmaStatus from './MapDmaStatus';
import MapFlowLoggerStatus from './MapFlowLoggerStatus';
import { KmlView } from 'web-common';
import Sticky from 'react-sticky-el';
import { withWidth, isWidthDown } from '@material-ui/core';

class MapStatus extends Component {
  refMap = React.createRef();
  state = { flgShowInfo: false };
  componentDidMount() {
    this.getDefaultZoom();
  }
  getDefaultZoom = () => {
    const __this = this;
    this.props.dataProvider(GET_ONE, 'nmsconfigs', { id: 'MapDefaultZoom' }).then(res => {
      if (res && res.data && res.data.value >= config.ZOOM_LIMIT_TO_SHOW_TEXT_MARKER) {
        __this.handleZoomChanged(null, res.data.value);
      }
    });
  };
  getStatus = data => {
    if (data.timeStatus != 'ok') {
      return data.timeStatus;
    }
    return data.status;
  };
  handleZoomChanged = (e, val) => {
    let zoom = val || this.refMap.current.getZoom();
    if (zoom) {
      const flgShowInfo = zoom >= config.ZOOM_LIMIT_TO_SHOW_TEXT_MARKER;
      if (this.state.flgShowInfo != flgShowInfo) {
        this.setState({ flgShowInfo: flgShowInfo });
      }
    }
  };
  componentDidUpdate(prevProps) {
    const { focus } = this.props;
    if (focus.id !== prevProps.focus.id && focus.position) {
      const map = this.refMap.current;
      if (map) {
        // todo
        map.panTo(focus.position);
      }
    }
  }

  render() {
    const { flgShowInfo } = this.state;
    const { currentStatus, baseOnFlowLogger, focus, theme, width } = this.props;
    const smDown = isWidthDown('sm', width);
    return (
      <Sticky disabled={smDown} holderProps={{ style: { width: '100%' } }} stickyStyle={{ bottom: 0 }}>
        <MapRenderWithConfig
          refMap={this.refMap}
          options={{ minHeight: '500px', width: '100%', height: '100vh', maxHeight: '1080px' }}
          onZoomChanged={this.handleZoomChanged}
        >
          {this.refMap && <KmlView types={['Pipe']} common="all" refMap={this.refMap} />}
          {baseOnFlowLogger ? (
            <MapFlowLoggerStatus
              flgShowInfo={flgShowInfo}
              theme={theme}
              focus={focus}
              getStatus={this.getStatus}
              currentStatus={currentStatus}
            />
          ) : (
            <MapDmaStatus focus={focus} theme={theme} getStatus={this.getStatus} currentStatus={currentStatus} />
          )}
        </MapRenderWithConfig>
      </Sticky>
    );
  }
}
MapStatus.propTypes = {
  dataProvider: PropTypes.func,
  currentStatus: PropTypes.array,
  baseOnFlowLogger: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  focus: PropTypes.object,
  width: PropTypes.number,
};
const enhance = compose(withDataProvider, withWidth());
export default enhance(MapStatus);
