import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Marker } from 'react-google-maps';
import withDataProvider from '../data/withDataProvider';
import { commonConfig } from '../actions/mapActions';
import MapRenderWithConfig from '../map/MapRenderWithConfig';

const mapStateToProps = state => {
  return {
    config: state.common,
  };
};
const mapDispatchToProps = { commonConfig };

@withDataProvider
@connect(mapStateToProps, mapDispatchToProps)
class MapRenderSpecifyPosition extends Component {
  constructor(props) {
    super(props);
  }

  onClick = coord => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    let tmp = { lat, lng };
    this.props.getPositionClick(tmp);
  };
  render() {
    // console.log('render map this.props', this.props);
    let { defaultCenter, defaultZoom, position, ...rest } = this.props;
    return (
      <MapRenderWithConfig
        configModel="ctmConfigs"
        onClick={this.onClick}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        {...rest}
      >
        {position && <Marker position={position} zIndex={210} />}
      </MapRenderWithConfig>
    );
  }
}
MapRenderSpecifyPosition.propTypes = {
  dataProvider: PropTypes.func,
  commonConfig: PropTypes.func,
  centerPointGeo: PropTypes.object,
  zoomLevel: PropTypes.number,
  getPositionClick: PropTypes.func,
  defaultZoom: PropTypes.number,
  defaultCenter: PropTypes.any,
  position: PropTypes.object,
};

export default MapRenderSpecifyPosition;
