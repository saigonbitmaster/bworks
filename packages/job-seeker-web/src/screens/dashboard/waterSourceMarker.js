import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Marker, InfoWindow, OverlayView } from 'react-google-maps';
import { compose } from 'recompose';
import { translate } from 'ra-loopback3';
import styled, { keyframes } from 'styled-components';

class WaterSourceMarker extends Component {
  state = {
    showInfoWindow: false,
  };

  handleMouseOver = () => {
    this.setState({
      showInfoWindow: true,
    });
  };
  handleMouseExit = () => {
    this.setState({
      showInfoWindow: false,
    });
  };

  render() {
    const { showInfoWindow } = this.state;
    const { watersource, status, translate, type } = this.props;
    const pulseAnimation = keyframes`{
                            0% {
                                transform: scale(.1, .1);
                                opacity: 0;
                                background-color: ${status.color}
                            }
                            50% {
                                opacity: 0.5;
                                background-color: ${status.color}
                            }
                            100% {
                                transform: scale(1, 1);
                                opacity: 0;
                                background-color: ${status.color}
                            }
             }`;

    const Pulse = styled.div`
      position: absolute;
      left: -28px;
      top: -30px;
      height: 50px;
      width: 50px;
      z-index: 20;
      opacity: 0;
      border: 2px solid ${status.color};
      background: transparent;
      border-radius: 60px;
      animation: ${pulseAnimation} ${status.speed} ease-out infinite;
    `;

    return (
      <div>
        {status.name !== 'normal' && (
          <OverlayView position={watersource.position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <presentation onClick={() => {}}>
              <Pulse />
            </presentation>
          </OverlayView>
        )}
        <Marker
          key={watersource.id}
          position={watersource.position}
          // icon={`/api/Icons/dropView/Adjust?size=64&status=${status.name}`}
          icon={`/api/Icons/dropView/${type}Icon?size=64&status=${status.name}`}
          onMouseOver={this.handleMouseOver}
          zIndex={200}
          onMouseOut={this.handleMouseExit}
        >
          {type === 'WaterSource' && showInfoWindow && (
            <InfoWindow key={watersource.id}>
              <span>
                {`Nguồn nước: ${watersource.name}`}
                <br />
                {translate(`generic.waterSourceMapMarkerStatus.${status.name}`)}
              </span>
            </InfoWindow>
          )}
          {type === 'Factory' && showInfoWindow && (
            <InfoWindow key={watersource.id}>
              <span>{`Nhà máy: ${watersource.name}`}</span>
            </InfoWindow>
          )}
        </Marker>
      </div>
    );
  }
}

WaterSourceMarker.propTypes = {
  watersource: PropTypes.object,
  status: PropTypes.object,
  translate: PropTypes.func,
  type: PropTypes.string,
};

const enhance = compose(translate);
export default enhance(WaterSourceMarker);
