import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { MapDma } from 'ra-loopback3';

class MapDmaStatus extends Component {
  render() {
    const { currentStatus, theme, getStatus } = this.props;
    if (!currentStatus) return null;
    let dmaLv2s = currentStatus.filter(dma => dma.level === 2);
    if (dmaLv2s && dmaLv2s.length > 0) {
      return (
        <Fragment>
          {dmaLv2s.map(dma => {
            let status = getStatus(dma.dmaData);
            return (
              <MapDma
                key={dma.id}
                dma={dma}
                mapitemprops={{
                  polygon: {
                    options: {
                      fillOpacity: 0.6,
                      fillColor: theme.status[status],
                      strokeWeight: 1,
                      strokeColor: theme.status[status],
                      zIndex: 1,
                    },
                  },
                }}
              />
            );
          })}
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
};

export default MapDmaStatus;
