import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { MapDma } from 'ra-loopback3';
import { withTheme } from '@material-ui/core';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';

class MapDmaWaterLoss extends Component {
  // kiem tra co children Dma
  hasChilDma = data => {
    let flg = false;
    if (!data || !data.length) {
      return flg;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].dmaLevel > 1) {
        flg = true;
        break;
      }
    }
    return flg;
  };
  render() {
    const { data, theme } = this.props;
    // console.log('render MapDmaWaterLoss: ', data);
    // let flgHasChild = this.hasChilDma(data);
    return (
      <MapRenderWithConfig options={{ minHeight: '800px', height: 'auto' }}>
        {data &&
          data.map(dma => {
            if (dma && dma.status) {
              return (
                <MapDma
                  key={dma.id}
                  dma={dma}
                  mapitemprops={{
                    polygon: {
                      options: {
                        // fillOpacity: !flgHasChild || dma.level > 1 ? 0.6 : 0,
                        fillOpacity: 0.6, // fill color ;  fillOpacity: 0 => show only line
                        fillColor: theme.status[dma.status],
                        strokeWeight: 1,
                        strokeColor: theme.status[dma.status],
                        zIndex: 1,
                      },
                    },
                  }}
                />
              );
            }
            return null;
          })}
      </MapRenderWithConfig>
    );
  }
}

MapDmaWaterLoss.propTypes = {
  data: PropTypes.array,
  theme: PropTypes.object,
};

const enhance = compose(withTheme);
export default enhance(MapDmaWaterLoss);
