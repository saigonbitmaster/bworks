import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapRenderWithConfig from '../../map/MapRenderWithConfig';
import MapDma from '../../map/MapDma';
import RawMapWaterSourceGroupInputDecorate from './RawMapWaterSourceGroupInputDecorate';

class RawMapWaterSourceGroupInput extends Component {
  state = {
    newPoints: null, // array point of polygon
    typeCropPolygon: '',
    newCenter: '',
  };

  onPolygonSecondComplete = points => {
    let { name, formRef } = this.props;
    if (formRef) {
      // update field
      formRef.current.props.change(name, points); // example:  name <=> source="boundary"
    }
    this.setState({ typeCropPolygon: '', newPoints: points }); // reset
  };

  // clear
  clearPolygon = () => {
    this.setState({ newPoints: [], newCenter: '' });
    let { name, formRef } = this.props;
    if (formRef) {
      // reset field
      formRef.current.props.change(name, null); // example:  name <=> source="boundary"
    }
  };

  handleUnion = () => {
    this.setState({ typeCropPolygon: 'union' });
  };

  handleSubtract = () => {
    this.setState({ typeCropPolygon: 'difference' }); // polygon1 - polygon2
  };

  // gadm
  getAreaPoint = (points, rect) => {
    let newCenter = '';

    // tinh toan centerPoint
    if (rect && rect.length === 4) {
      let lat = (rect[1] + rect[3]) / 2;
      let lng = (rect[0] + rect[2]) / 2;
      newCenter = { lat, lng };
    } else if (points && points.length) {
      newCenter = points[0];
    }

    // console.log('getAreaPoint', points, rect, newCenter);

    this.setState({ newPoints: points, newCenter });
    let { name, formRef } = this.props;
    if (formRef) {
      // update field
      formRef.current.props.change(name, points); // example:  name <=> source="boundary"
    }
  };
  render() {
    const {
      value = [],
      onChange,
      mapitemprops = {},
      decorate,
      name,
      formRef,
      enableCropPolygons,
      enableDeletePolygons,
      onlyShow,
    } = this.props;
    let { typeCropPolygon, newPoints, newCenter } = this.state;
    let center = undefined;
    if (value && value[0]) {
      center = value[0];
    } else {
      center = newCenter;
    }
    // console.log('RawMapWaterSourceGroupInput', this.props);
    return (
      <MapRenderWithConfig
        configModel="srcConfigs"
        center={center}
        options={{ maxHeight: '400px' }}
        enableCropPolygons={enableCropPolygons}
        enableDeletePolygons={enableDeletePolygons}
        name={name}
        formRef={formRef}
        clearPolygon={this.clearPolygon}
        handleUnion={this.handleUnion}
        handleSubtract={this.handleSubtract}
      >
        <MapDma
          editable
          // path={value || []}
          path={value ? value : newPoints}
          onChange={onChange}
          mapitemprops={mapitemprops}
          enableCropPolygons={enableCropPolygons}
          typeCropPolygon={typeCropPolygon}
          onPolygonSecondComplete={this.onPolygonSecondComplete}
          onlyShow={onlyShow}
        />
        <RawMapWaterSourceGroupInputDecorate {...decorate} />
      </MapRenderWithConfig>
    );
  }
}

RawMapWaterSourceGroupInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  mapitemprops: PropTypes.object,
  decorate: PropTypes.object,
  formRef: PropTypes.object,
  enableCropPolygons: PropTypes.bool,
  name: PropTypes.string,
  enableDeletePolygons: PropTypes.bool,
  onlyShow: PropTypes.bool,
};

export default RawMapWaterSourceGroupInput;
