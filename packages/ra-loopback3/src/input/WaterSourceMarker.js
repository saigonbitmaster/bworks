import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Marker, InfoWindow } from 'react-google-maps';
import { compose } from 'recompose';
// import { keyframes } from 'styled-components';
import { translate } from 'react-admin';
import changeCase from 'change-case';
class WaterSourceMarker extends Component {
  state = {
    showInfoWindow: true,
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
    const { info, translate, type } = this.props;
    // const pulseAnimation = keyframes`{
    //                         0% {
    //                             transform: scale(.1, .1);
    //                             opacity: 0;
    //                             background-color: ${status.color}
    //                         }
    //                         50% {
    //                             opacity: 0.5;
    //                             background-color: ${status.color}
    //                         }
    //                         100% {
    //                             transform: scale(1, 1);
    //                             opacity: 0;
    //                             background-color: ${status.color}
    //                         }
    //          }`;

    // const Pulse = styled.div`
    //   position: absolute;
    //   left: -28px;
    //   top: -30px;
    //   height: 50px;
    //   width: 50px;
    //   z-index: 20;
    //   opacity: 0;
    //   border: 2px solid ${status.color};
    //   background: transparent;
    //   border-radius: 60px;
    //   animation: ${pulseAnimation} ${status.speed} ease-out infinite;
    // `;

    return (
      <div>
        {/* {status.name !== 'normal' && (
          <OverlayView position={info.position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <presentation onClick={() => {}}>
              <Pulse />
            </presentation>
          </OverlayView>
        )} */}
        <Marker
          key={info.id}
          position={info.position}
          // icon={`/api/Icons/dropView/Adjust?size=64&status=${status.name}`}
          icon={`/api/Icons/dropView/${type}Icon?size=64&status=normal`}
          // onMouseOver={this.handleMouseOver}
          zIndex={200}
          // onMouseOut={this.handleMouseExit}
        >
          {showInfoWindow && (
            <InfoWindow key={info.id}>
              <span>
                {type !== '' && `${translate(`ra.${changeCase.lowerCaseFirst(type)}`)}: ${info.name}`}
                {type === '' && `${info.name}`}
              </span>
            </InfoWindow>
          )}
        </Marker>
      </div>
    );
  }
}
WaterSourceMarker.defaultProps = {
  type: '',
};
WaterSourceMarker.propTypes = {
  info: PropTypes.object,
  status: PropTypes.object,
  translate: PropTypes.func,
  type: PropTypes.string,
};

const enhance = compose(translate);
export default enhance(WaterSourceMarker);
