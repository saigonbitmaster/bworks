import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withDataProvider, CUSTOM, MapRender } from 'ra-loopback3';
import { commonConfig } from '../../actions/mapActions';

class MapRenderWithConfig extends Component {
  componentDidMount() {
    const {
      dataProvider,
      config: { MapDefaultCenter: defaultCenter, MapDefaultCenter: defaultZoom },
      commonConfig,
    } = this.props;

    if (!defaultCenter || !defaultZoom) {
      // get config from server
      dataProvider(CUSTOM, 'ctmconfigs', { rawFilter: { id: { inq: ['MapDefaultCenter', 'MapDefaultZoom'] } } }).then(
        res => {
          if (res && res.data) {
            let payloadConfig = {};
            res.data.map(item => {
              payloadConfig[item.id] = item.value;
            });
            commonConfig(payloadConfig);
          }
        },
      );
    }
  }

  render() {
    const {
      dataProvider,
      config: { MapDefaultCenter: defaultCenter, MapDefaultZoom: defaultZoom },
      commonConfig,
      zoomLevel,
      centerPointGeo,
      refMap,
      ...rest
    } = this.props;
    if (!defaultCenter || !defaultZoom) {
      return null;
    }
    // console.log('map render', centerPointGeo, zoomLevel);
    let pt;
    let zoom;
    if (centerPointGeo.lat && centerPointGeo.lng) {
      pt = centerPointGeo;
    } else {
      pt = defaultCenter;
    }
    if (zoomLevel) {
      zoom = zoomLevel;
    } else {
      zoom = defaultZoom;
    }
    return <MapRender isPaper refMap={refMap} center={pt} zoom={zoom} {...rest} />;
  }
}
MapRenderWithConfig.propTypes = {
  dataProvider: PropTypes.func,
  config: PropTypes.object,
  commonConfig: PropTypes.func,
  centerPointGeo: PropTypes.object,
  zoomLevel: PropTypes.number,
  refMap: PropTypes.any,
};

const mapStateToProps = state => {
  return {
    config: state.common,
  };
};
const mapDispatchToProps = { commonConfig };

export default compose(withDataProvider, connect(mapStateToProps, mapDispatchToProps))(MapRenderWithConfig);
