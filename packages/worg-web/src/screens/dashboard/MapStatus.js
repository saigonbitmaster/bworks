import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withDataProvider, mapStyles } from 'ra-loopback3';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import MapFactories from './MapFactories';
import { KmlView } from 'web-common';

class MapStatus extends Component {
  state = {
    mapKmls: {},
    centerPointGeo: {},
    zoomLevel: null,
  };
  refMap = createRef();
  refMapFactory = createRef();

  getStatus = data => {
    if (data.timeStatus != 'ok') {
      return data.timeStatus;
    }
    return data.status;
  };
  onMapClick = () => {
    if (this.refMapFactory.current) {
      this.refMapFactory.current.onRelease();
    }
  };
  render() {
    const { onChangeSelectedFactory } = this.props;
    return (
      <MapRenderWithConfig
        options={{ minHeight: '700px', height: 'auto' }}
        styles={mapStyles.default}
        refMap={this.refMap}
        onClick={this.onMapClick}
      >
        <KmlView types={['Pipe']} />
        <MapFactories
          refMap={this.refMap}
          refMapFactory={this.refMapFactory}
          onChangeSelectedFactory={onChangeSelectedFactory}
        />
      </MapRenderWithConfig>
    );
  }
}
MapStatus.propTypes = {
  dataProvider: PropTypes.func,
  currentStatus: PropTypes.array,
  baseOnFlowLogger: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  onChangeSelectedFactory: PropTypes.func,
};
const enhance = compose(withDataProvider);
export default enhance(MapStatus);
