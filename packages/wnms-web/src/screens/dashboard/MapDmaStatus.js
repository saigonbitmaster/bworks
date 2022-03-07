import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MapDma } from 'ra-loopback3';
// import { Marker } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import { blue } from '@material-ui/core/colors';

class MapDmaStatus extends Component {
  render() {
    const { currentStatus, theme, getStatus, focus } = this.props;
    if (!currentStatus) return null;
    // let dmaLv2s = currentStatus.filter(dma => dma.level === 2);
    // let dmaLv1s = currentStatus.filter(dma => dma.level === 1);
    if (currentStatus && currentStatus.length > 0) {
      return (
        <Fragment>
          {currentStatus.map(dma => {
            let status = getStatus(dma.dmaData);
            return (
              <Fragment key={dma.id}>
                <MapDma
                  dma={dma}
                  mapitemprops={{
                    polygon: {
                      options: {
                        fillOpacity: dma.level > 2 || focus.id === dma.id ? 0.6 : 0,
                        strokeOpacity: focus.id === dma.id ? 0.8 : 0.5,
                        fillColor: focus.id === dma.id ? blue[500] : theme.status[status] || theme.status['loss'],
                        strokeWeight: 3 / dma.level,
                        strokeColor: focus.id === dma.id ? blue[500] : theme.status[status] || theme.status['loss'],
                        zIndex: dma.level + 1,
                      },
                    },
                  }}
                />
                <MarkerWithLabel
                  position={dma.center}
                  icon=" "
                  labelClass="marker-label"
                  labelAnchor={{ x: 0, y: 0 }}
                  labelStyle={{
                    color: focus.id === dma.id ? blue[500] : theme.status[status] || theme.status['loss'],
                    fontSize: `${100 + Math.round(50 / dma.level)}%`,
                    animation: focus.id === dma.id ? 'blink1 1s linear infinite' : undefined,
                  }}
                >
                  <div>{dma.name}</div>
                </MarkerWithLabel>
              </Fragment>
            );
          })}
          {/* {dmaLv2s.map(dma => {
            let status = getStatus(dma.dmaData);
            return (
              <Fragment key={dma.id}>
                <MapDma
                  key={dma.id}
                  dma={dma}
                  mapitemprops={{
                    polygon: {
                      options: {
                        fillOpacity: 0.6,
                        fillColor: focus.id === dma.id ? blue[500] : theme.status[status] || theme.status['loss'],
                        strokeWeight: 1,
                        strokeColor: focus.id === dma.id ? blue[500] : theme.status[status] || theme.status['loss'],
                        zIndex: 1,
                      },
                    },
                  }}
                />
                <MarkerWithLabel
                  position={dma.center}
                  icon=" "
                  labelClass="marker-label"
                  labelAnchor={{ x: 0, y: 0 }}
                  labelStyle={{
                    color: 'white',
                    animation: focus.id === dma.id ? 'blink1 1s linear infinite' : undefined,
                  }}
                >
                  <div>{dma.name}</div>
                </MarkerWithLabel>
              </Fragment>
            );
          })} */}
        </Fragment>
      );
    }
    return null;
  }
}

MapDmaStatus.propTypes = {
  theme: PropTypes.object,
  currentStatus: PropTypes.array,
  getStatus: PropTypes.func,
  focus: PropTypes.any,
};

export default MapDmaStatus;
