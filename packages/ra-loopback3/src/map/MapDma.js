import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Polygon, Polyline } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import { withTheme } from '@material-ui/core';
import clone from 'lodash/clone';
import PolyBool from 'polybooljs';
import WrapperCoordinateMap from '../util/WrapperCoordinateMap';

class MapDma extends Component {
  static propTypes = {
    path: PropTypes.array,
    dma: PropTypes.object,
    zIndex: PropTypes.number,
    editable: PropTypes.bool,
    onChange: PropTypes.func,
    mapitemprops: PropTypes.object,
    theme: PropTypes.object,
    enableCropPolygons: PropTypes.bool,
    typeCropPolygon: PropTypes.oneOf(['', 'union', 'difference', 'many']),
    onPolygonSecondComplete: PropTypes.func,
    onlyShow: PropTypes.bool,
  };

  static defaultProps = {
    zIndex: 100,
    editable: false,
  };

  constructor(props) {
    super(props);
    this.polyRef = React.createRef();
  }
  // state = {
  //   flgTest: false,
  // };
  mvcArrayToArray = (mvcArray, removeIndex = -1) => {
    let result = [];
    mvcArray.forEach((point, index) => {
      if (index !== removeIndex) {
        result.push({ lat: point.lat(), lng: point.lng() });
      }
    });
    return result;
  };

  onPolygonComplete = polygon => {
    this.props.onChange(this.mvcArrayToArray(polygon.getPath()));
    // remove polygon from drawing manager
    polygon.setMap(null);
  };

  convertArrayObjectToArray = data => {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let tmp = [item.lat, item.lng];
      res.push(tmp);
    }
    return res;
  };
  convertArrayToArrayObject = data => {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let tmp = { lat: item[0], lng: item[1] };
      res.push(tmp);
    }
    return res;
  };
  // polygon 2
  onPolygonSecondComplete = polygon => {
    // console.log('onPolygonSecondComplete', polygon);

    let { path, typeCropPolygon } = this.props;
    if (!path || !typeCropPolygon) {
      polygon.setMap(null);
      return;
    }

    // first polygon
    let firstPoints = this.convertArrayObjectToArray(path);

    // second polygon
    let pathSecond = this.mvcArrayToArray(polygon.getPath());
    let secondPoints = this.convertArrayObjectToArray(pathSecond);

    // console.log('first polyggon:', firstPoints);
    // console.log('second polyggon:', secondPoints);
    let final = [];
    if (typeCropPolygon === 'union' || typeCropPolygon === 'difference') {
      // typeCropPolygon: 'union' or 'difference'
      let res = PolyBool[typeCropPolygon](
        {
          regions: [firstPoints],
          inverted: false,
        },
        {
          regions: [secondPoints],
          inverted: false,
        },
      );
      if (res && res.regions.length) {
        final = this.convertArrayToArrayObject(res.regions[0]);
      }
    } else if (typeCropPolygon === 'many') {
      final = WrapperCoordinateMap.convertTwoPolygonToGeoJson(path, polygon.getPath());
      this.setState({ flgTest: true });
    }

    // console.log('res', res.regions[0]);
    // console.log('final', final);
    this.props.onPolygonSecondComplete(final);
    polygon.setMap(null);
  };
  onDragEnd = () => {
    // current version
    this.props.onChange(this.mvcArrayToArray(this.polyRef.current.getPath()));

    // next version
    // let paths = this.polyRef.current.getPaths();
    // let final = WrapperCoordinateMap.convertMultiPolygonToGeoJson(paths);
    // this.setState({ flgTest: true });
    // this.props.onChange(final);
    // ===
  };

  onRightClick = e => {
    // remove point click
    this.props.onChange(this.mvcArrayToArray(this.polyRef.current.getPath(), e.vertex));
  };
  render() {
    let {
      typeCropPolygon,
      enableCropPolygons,
      path,
      dma,
      zIndex,
      editable,
      mapitemprops = { polygon: {}, parentDmaId: '' },
      theme,
      onlyShow,
      ...rest
    } = this.props;
    // console.log('map dma: ', this.props);

    // next version
    // if (this.state.flgTest) path = WrapperCoordinateMap.convertGeoJsonToMap(path, 'MultiPolygon');
    // ====

    // console.log('map dma state: ', this.state);
    let { polygon = {}, parentDmaId = '' } = mapitemprops;
    if (!polygon.options) {
      polygon.options = dma ? theme.dma.level[dma.level] : editable ? theme.dma.edit : theme.dma.level[1];
      // avoid change default theme.
      polygon.options = clone(polygon.options);
    }
    if (mapitemprops.noFill || (dma && parentDmaId === dma.id)) {
      // avoid change default theme.
      polygon.options.fillOpacity = 0;
    }
    /* eslint-disable no-undef */
    let maps = google.maps;

    /* eslint-enable no-undef */
    if ((path && path.length) || (dma && dma.boundary)) {
      // if(onlyShow) {
      //   return <Polygon path={fixPath} {...rest} ref={this.polyRef} {...rest} {...polygon} editable={false} draggable={false} />;
      // }
      let editProps = {};
      let fixPath = path || dma.boundary;
      if (editable) {
        editProps = {
          editable: true,
          draggable: true,
          onMouseUp: this.onDragEnd,
          onDragEnd: this.onDragEnd,
          onRightClick: this.onRightClick,
        };
        if (!typeCropPolygon) {
          return (
            <Polygon
              path={fixPath}
              {...rest}
              ref={this.polyRef}
              {...rest}
              {...polygon}
              {...editProps}
              editable={!onlyShow}
              draggable={!onlyShow}
            />
          );
        } else {
          return (
            <Fragment>
              {typeCropPolygon === 'many' && (
                <Polygon paths={fixPath} {...rest} ref={this.polyRef} {...rest} {...polygon} {...editProps} />
              )}
              {/* polygon 1 */}
              {typeCropPolygon !== 'many' && (
                <Polygon path={fixPath} {...rest} ref={this.polyRef} {...rest} {...polygon} {...editProps} />
              )}
              {/* polygon 2 */}
              <DrawingManager
                onPolygonComplete={this.onPolygonSecondComplete}
                defaultDrawingMode={maps.drawing.OverlayType.POLYGON}
                editable
                defaultOptions={{
                  drawingControl: false,
                  polygonOptions: polygon.options || {
                    strokeColor: '#f44336',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#f44336',
                    fillOpacity: 0.35,
                    zIndex: 100,
                    geodesic: true,
                  },
                }}
                {...rest}
              />
            </Fragment>
          );
        }
      }
      let Draw = Polygon;
      if (polygon.options && polygon.options.fillOpacity === 0) {
        Draw = Polyline;
        if (fixPath.length > 0) {
          fixPath.push(fixPath[0]);
        }
      }
      return <Draw path={fixPath} {...rest} ref={this.polyRef} {...polygon} {...rest} />;
    } else if (editable) {
      return (
        <DrawingManager
          onPolygonComplete={this.onPolygonComplete}
          defaultDrawingMode={maps.drawing.OverlayType.POLYGON}
          editable
          defaultOptions={{
            drawingControl: false,
            polygonOptions: polygon.options || {
              strokeColor: '#f44336',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#f44336',
              fillOpacity: 0.35,
              zIndex: 100,
              geodesic: true,
            },
          }}
          {...rest}
        />
      );
    }
    return null;
  }
}

export default withTheme(MapDma);
