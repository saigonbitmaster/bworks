import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce, get } from 'lodash';
import { MapRender } from '../../LocalExport';
import MapNode from '../../map/MapNode';
import MapNodeListWithData from '../../map/MapNodeListWithData';
import RawMapDmaInputDecorate from './RawMapDmaInputDecorate';

class RawMapNodeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: props.center || props.defaultCenter,
    };
    this.refMap = React.createRef();
  }
  onMapClick = e => {
    if (!this.props.value) {
      let position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.props.onChange(position);
    }
  };

  onMapCenterChanged = debounce(() => {
    let center = this.refMap.current.getCenter();
    center = { lat: center.lat(), lng: center.lng() };
    this.setState({ center });
  }, 100);

  render() {
    const {
      zoom,
      value,
      onChange,
      mapitemprops = {},
      formData,
      dataProvider,
      center,
      defaultCenter,
      decorate,
      children,
    } = this.props;
    return (
      <MapRender
        refMap={this.refMap}
        onClick={this.onMapClick}
        zoom={zoom || 12}
        options={{ maxHeight: '450px' }}
        defaultCenter={center || defaultCenter}
        onCenterChanged={this.onMapCenterChanged}
      >
        {children}
        <MapNode editable position={value} onChange={onChange} mapitemprops={mapitemprops} />
        <MapNodeListWithData dataProvider={dataProvider} excludeId={get(formData, 'id')} center={this.state.center} />
        <RawMapDmaInputDecorate {...decorate} />
      </MapRender>
    );
  }
}

RawMapNodeInput.propTypes = {
  formData: PropTypes.object,
  dataProvider: PropTypes.func,
  center: PropTypes.object, // edit case
  defaultCenter: PropTypes.object,
  zoom: PropTypes.number,
  value: PropTypes.any,
  onChange: PropTypes.func,
  mapitemprops: PropTypes.object,
  decorate: PropTypes.object,
  children: PropTypes.node,
};

export default RawMapNodeInput;
