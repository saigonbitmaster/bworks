import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapRender } from '../../LocalExport';
import MapDma from '../../map/MapDma';
import RawMapDmaInputDecorate from './RawMapDmaInputDecorate';
class RawMapDmaInput extends Component {
  state = {
    newPoints: null, // array point of polygon
    typeCropPolygon: '',
    newCenter: '',
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

  handleUnion = () => {
    this.setState({ typeCropPolygon: 'union' });
  };

  handleSubtract = () => {
    this.setState({ typeCropPolygon: 'difference' }); // polygon1 - polygon2
  };

  // xu ly ve nhieu poylygon
  handleDrawMany = () => {
    this.setState({ typeCropPolygon: 'many' });
  };

  onPolygonSecondComplete = points => {
    let { name, formRef } = this.props;
    if (formRef) {
      // update field
      formRef.current.props.change(name, points); // example:  name <=> source="boundary"
    }
    this.setState({ typeCropPolygon: '', newPoints: points }); // reset
  };
  render() {
    const {
      enableSearchGadm,
      enableSearchDma,
      enableCropPolygons,
      enableDeletePolygons,
      enableDrawManyPolygons,
      defaultCenter,
      defaultZoom,
      value = [],
      center,
      onChange,
      mapitemprops = {},
      decorate,
      children,
    } = this.props;
    let options = {};
    if (center) {
      options.center = center;
    }
    let { typeCropPolygon, newPoints, newCenter } = this.state;
    // console.log('RawMapDmaInput render: ', this.props);
    // console.log('RawMapDmaInput state:', this.state);
    return (
      <MapRender
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        center={newCenter}
        {...options}
        key="map"
        options={{ maxHeight: '400px' }}
        enableSearchGadm={enableSearchGadm}
        enableSearchDma={enableSearchDma}
        clearPolygon={this.clearPolygon}
        enableCropPolygons={enableCropPolygons}
        getAreaPoint={this.getAreaPoint}
        handleUnion={this.handleUnion}
        handleSubtract={this.handleSubtract}
        handleDrawMany={this.handleDrawMany}
        enableDeletePolygons={enableDeletePolygons}
        enableDrawManyPolygons={enableDrawManyPolygons}
      >
        {children && children}
        <MapDma
          editable
          path={value ? value : newPoints}
          onChange={onChange}
          mapitemprops={mapitemprops}
          enableCropPolygons={enableCropPolygons}
          typeCropPolygon={typeCropPolygon}
          onPolygonSecondComplete={this.onPolygonSecondComplete}
        />
        <RawMapDmaInputDecorate {...decorate} />
      </MapRender>
    );
  }
}

RawMapDmaInput.propTypes = {
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  center: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  mapitemprops: PropTypes.object,
  decorate: PropTypes.object,
  enableSearchGadm: PropTypes.bool,
  enableSearchDma: PropTypes.bool,
  formRef: PropTypes.object,
  enableCropPolygons: PropTypes.bool,
  name: PropTypes.string,
  enableDeletePolygons: PropTypes.bool,
  enableDrawManyPolygons: PropTypes.bool,
  children: PropTypes.node,
};

export default RawMapDmaInput;
