import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import MapRender from '../map/MapRender';
import { CUSTOM } from '../data/LoopbackRest';
import withDataProvider from '../data/withDataProvider';
import { commonConfig } from '../actions/mapActions';

class MapRenderWithConfig extends Component {
  state = {
    newPoints: null, // array point of polygon
    typeCropPolygon: '',
    newCenter: '',
  };
  componentDidMount() {
    const {
      dataProvider,
      config: { MapDefaultCenter: defaultCenter, MapDefaultCenter: defaultZoom },
      commonConfig,
      configModel,
    } = this.props;
    if (!defaultCenter || !defaultZoom) {
      // get config from server
      dataProvider(CUSTOM, configModel, { rawFilter: { id: { inq: ['MapDefaultCenter', 'MapDefaultZoom'] } } }).then(
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
      config,
      commonConfig,
      zoomLevel,
      centerPointGeo,
      defaultCenter,
      defaultZoom,
      enableCropPolygons,
      enableDeletePolygons,
      ...rest
    } = this.props;
    // console.log('map render config', this.props);
    return (
      <MapRender
        isPaper
        defaultCenter={defaultCenter || config.MapDefaultCenter}
        defaultZoom={defaultZoom || config.MapDefaultZoom}
        {...rest}
        enableCropPolygons={enableCropPolygons}
        enableDeletePolygons={enableDeletePolygons}
        clearPolygon={this.props.clearPolygon}
      />
    );
  }
}
MapRenderWithConfig.propTypes = {
  configModel: PropTypes.string,
  dataProvider: PropTypes.func,
  config: PropTypes.object,
  commonConfig: PropTypes.func,
  centerPointGeo: PropTypes.object,
  zoomLevel: PropTypes.number,
  defaultCenter: PropTypes.any,
  defaultZoom: PropTypes.any,
  enableCropPolygons: PropTypes.bool,
  enableDeletePolygons: PropTypes.bool,
  clearPolygon: PropTypes.func,
};
MapRenderWithConfig.defaultProps = {
  configModel: 'nmsconfigs',
};

const mapStateToProps = state => {
  return {
    config: state.common,
  };
};
const mapDispatchToProps = { commonConfig };

export default compose(withDataProvider, connect(mapStateToProps, mapDispatchToProps))(MapRenderWithConfig);
