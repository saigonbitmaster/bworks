import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MapDma from './MapDma';

class MapDmaList extends Component {
  static propTypes = {
    dmas: PropTypes.any,
    options: PropTypes.object,
  };
  render() {
    const { dmas, ...rest } = this.props;
    if (dmas && dmas.length > 0) {
      return (
        <Fragment>
          {dmas.map(dma => (
            <MapDma key={dma.id} {...rest} dma={dma} />
          ))}
        </Fragment>
      );
    }
    return null;
  }
}

export default MapDmaList;
