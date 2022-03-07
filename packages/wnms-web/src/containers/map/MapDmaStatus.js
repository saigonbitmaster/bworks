import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { MapDma } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';

class MapDmaStatus extends Component {
  render() {
    const { currentStatus = [], theme } = this.props;
    return (
      <Fragment>
        {currentStatus.map(dma => {
          if (dma.dmaData && dma.dmaData.logTime) {
            let status = dma.dmaData.timeStatus !== 'ok' ? dma.dmaData.timeStatus : dma.dmaData.status;
            let color = theme.status[status];
            return (
              <MapDma
                key={dma.id}
                dma={dma}
                mapitemprops={{
                  polygon: {
                    options: {
                      strokeColor: color,
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: color,
                      fillOpacity: dma.level > 1 ? 0.5 : 0,
                      zIndex: 100,
                      geodesic: true,
                    },
                  },
                }}
              />
            );
          }
          return null;
        })}
      </Fragment>
    );
  }
}
MapDmaStatus.propTypes = {
  currentStatus: PropTypes.array,
  theme: PropTypes.object,
};
const enhance = compose(withTheme);
export default enhance(MapDmaStatus);
