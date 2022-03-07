import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import Marker from './Marker';
import WrapperCoordinateMap from '../util/WrapperCoordinateMap';
class MapMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {},
    };
  }
  componentWillUnmount() {
    this.unmount = true;
  }
  onMarkerComplete = marker => {
    let position = { lat: marker.position.lat(), lng: marker.position.lng() };
    this.setState({ position });
    this.props.onChange(WrapperCoordinateMap.convertPointToGeoJson(position));
  };
  render() {
    // console.log('render map material node ', this.props);
    // eslint-disable-next-line
    let maps = google.maps;
    const { theme, model, label, defaultTitle, flgShowInfo, ...rest } = this.props;
    return (
      <Fragment>
        <Marker {...rest} position={this.state.position} flgShowInfo={false} />
        <DrawingManager
          onMarkerComplete={this.onMarkerComplete}
          defaultDrawingMode={maps.drawing.OverlayType.MARKER}
          editable
          defaultOptions={{
            drawingControl: false,
            markerOptions: {
              draggable: true,
              visible: false,
            },
          }}
          {...rest}
        />
      </Fragment>
    );
  }
}

MapMaterial.propTypes = {
  icon: PropTypes.any,
  data: PropTypes.any,
  id: PropTypes.string,
  model: PropTypes.string,
  dataProvider: PropTypes.func.isRequired,
  marker: PropTypes.object,
  label: PropTypes.any,
  theme: PropTypes.object,
  flgShowInfo: PropTypes.bool,
  defaultTitle: PropTypes.any,
  onChange: PropTypes.func,
};
export default withTheme(MapMaterial);
