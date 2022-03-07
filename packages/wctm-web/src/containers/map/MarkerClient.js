import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withTheme } from '@material-ui/core';
import { Marker, InfoWindow } from 'react-google-maps';

class MarkerClient extends Component {
  state = {
    showInfoWindow: false,
  };

  // singleMarkerRef = React.createRef();

  handleMouseOver = () => this.setState({ showInfoWindow: true });

  handleMouseExit = () => this.setState({ showInfoWindow: false });

  // getStatus = () => this.props.infoClient.status;

  render() {
    const {
      infoClient: {
        _id,
        name,
        formattedAddress,
        position: { coordinates },
        status,
      },
      pathIcon,
      stylePopup,
    } = this.props;
    const { showInfoWindow } = this.state;

    let lct = new google.maps.LatLng(coordinates[1], coordinates[0]); // eslint-disable-line
    return (
      <Marker
        key={_id}
        position={lct}
        icon={{
          url: pathIcon,
        }}
        zIndex={200}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseExit}
        noRedraw={true}
        options={{ status }}
      >
        {showInfoWindow && (
          <InfoWindow key={_id}>
            <div style={stylePopup}>
              <h4>{name} </h4>
              <h5>{formattedAddress} </h5>
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

MarkerClient.propTypes = {
  data: PropTypes.array,
  theme: PropTypes.object,
  centerPointGeo: PropTypes.object,
  zoomLevel: PropTypes.number,
  infoClient: PropTypes.object,
  pathIcon: PropTypes.string,
  clientStatus: PropTypes.string,
  stylePopup: PropTypes.object,
};

const enhance = compose(withTheme);
export default enhance(MarkerClient);
