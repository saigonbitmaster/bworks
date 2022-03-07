import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import geolib from 'geolib';
import { MapRender } from '../../LocalExport';
import MapPipe from '../../map/MapPipe';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import MapWaterSource from '../MapWaterSource';
import { CUSTOM } from 'ra-loopback3';
class RawMapPipeInputV2 extends Component {
  refMap = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      drawing: !props.value || props.value.length == 0,
      center: props.defaultCenter,
      nodes: [],
      mousePosition: null,
      pipes: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    let drawing = !props.value || props.value.length == 0;
    return { ...state, drawing };
  }

  onMapCenterChanged = debounce(() => {
    let center = this.refMap.current.getCenter();
    // calculateDistance for update
    center = { lat: center.lat(), lng: center.lng() };
    let distance = geolib.getDistance(
      { latitude: this.state.center.lat, longitude: this.state.center.lng },
      { latitude: center.lat, longitude: center.lng },
    );
    if (distance > this.props.reloadCenterDistance) {
      this.setState({ center });
    }
  }, 500);

  componentWillUnmount() {
    this.onMapCenterChanged.cancel();
  }

  onMouseMove = e => {
    const { formData } = this.props;
    if (formData.fromNodeId && !formData.toNodeId) {
      let mousePosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.setState({
        mousePosition,
      });
    }
  };
  mvcArrayToArray = (mvcArray, removeIndex = -1) => {
    let result = [];
    mvcArray.forEach((point, index) => {
      if (index !== removeIndex) {
        result.push({ lat: point.lat(), lng: point.lng() });
      }
    });
    return result;
  };
  onPolylineComplete = polyline => {
    let points = this.mvcArrayToArray(polyline.getPath());
    if (!points.length) return;
    const { onChange } = this.props;
    onChange(points);
    // onFromPositionChange(points[0]);
    // onToPositionChange(points[points.length - 1]);
    polyline.setMap(null);
  };
  componentDidMount() {
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
  }
  render() {
    const { defaultCenter, defaultZoom, dataProvider, value = [], onChange, mapitemprops = {}, formData } = this.props;
    let { pipes } = this.state;
    return (
      <MapRender
        refMap={this.refMap}
        onCenterChanged={this.onMapCenterChanged}
        // onMouseMove={this.onMouseMove}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        options={{ maxHeight: '450px' }}
      >
        {/* case EDIT */}
        <MapWaterSource dataProvider={dataProvider} />
        <MapPipe editable path={value} onChange={onChange} mapitemprops={mapitemprops} />
        {/* end case EDIT */}

        {/* case CREATE && EDIT */}
        {pipes.length &&
          pipes.map(item => {
            if (formData.id !== item.id)
              return <MapPipe key={item.id} path={item.polyline} onChange={onChange} mapitemprops={mapitemprops} />;
          })}
        {/* end case CREATE && EDIT */}

        {/* case CREATE */}
        {!value.length && (
          <DrawingManager
            onPolylineComplete={this.onPolylineComplete}
            defaultDrawingMode={'polyline'}
            defaultOptions={{
              drawingControl: false,
              polylineOptions: {
                strokeColor: '#f44336',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#f44336',
                fillOpacity: 0.35,
                zIndex: 100,
                editable: true,
                clickable: true,
              },
            }}
            {...this.props}
          />
        )}
        {/* end case CREATE */}
      </MapRender>
    );
  }
}

RawMapPipeInputV2.propTypes = {
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  dataProvider: PropTypes.func,
  onFromPositionChange: PropTypes.func.isRequired,
  onToPositionChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  mapitemprops: PropTypes.object,
  decorate: PropTypes.object,
  reloadCenterDistance: PropTypes.number,
};
RawMapPipeInputV2.defaultProps = {
  reloadCenterDistance: 1000, // meter
};

export default RawMapPipeInputV2;
