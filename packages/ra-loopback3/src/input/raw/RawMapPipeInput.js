import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import geolib from 'geolib';
import { MapRender } from '../../LocalExport';
import MapPipe from '../../map/MapPipe';
import MapNodeListWithData from '../../map/MapNodeListWithData';
import RawMapPipeInputDecorate from './RawMapPipeInputDecorate';

class RawMapPipeInput extends Component {
  refMap = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      drawing: !props.value || props.value.length == 0,
      center: props.defaultCenter,
      nodes: [],
      mousePosition: null,
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

  onNodeClick = (e, node) => {
    const { formData, onChange, value, onFromNodeChange, onToNodeChange } = this.props;
    if (!formData.fromNodeId) {
      onFromNodeChange(node.id);
      onChange([node.position]);
    } else if (!formData.toNodeId) {
      onToNodeChange(node.id);
      onChange([...value, node.position]);
    }
  };

  onMouseMove = e => {
    const { formData } = this.props;
    if (formData.fromNodeId && !formData.toNodeId) {
      let mousePosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.setState({
        mousePosition,
      });
    }
  };

  render() {
    const {
      defaultCenter,
      defaultZoom,
      value = [],
      formData,
      onChange,
      mapitemprops = {},
      dataProvider,
      decorate,
      children,
    } = this.props;
    let fixValue =
      formData.fromNodeId && !formData.toNodeId && this.state.mousePosition
        ? [...value, this.state.mousePosition]
        : value || [];
    return (
      <MapRender
        refMap={this.refMap}
        onCenterChanged={this.onMapCenterChanged}
        onMouseMove={this.onMouseMove}
        defaultZoom={defaultZoom}
        defaultCenter={defaultCenter}
        options={{ maxHeight: '450px' }}
      >
        {children}
        <MapPipe editable path={fixValue} onChange={onChange} mapitemprops={mapitemprops} />
        <MapNodeListWithData dataProvider={dataProvider} onClick={this.onNodeClick} center={this.state.center} />
        <RawMapPipeInputDecorate {...decorate} onMouseMove={this.onMouseMove} />
      </MapRender>
    );
  }
}

RawMapPipeInput.propTypes = {
  defaultCenter: PropTypes.object,
  defaultZoom: PropTypes.number,
  dataProvider: PropTypes.func,
  onFromNodeChange: PropTypes.func.isRequired,
  onToNodeChange: PropTypes.func.isRequired,
  formData: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  mapitemprops: PropTypes.object,
  decorate: PropTypes.object,
  reloadCenterDistance: PropTypes.number,
  children: PropTypes.node,
};
RawMapPipeInput.defaultProps = {
  reloadCenterDistance: 1000, // meter
};

export default RawMapPipeInput;
