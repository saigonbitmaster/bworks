import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapDmaList } from 'ra-loopback3';
import { getDmaList } from '../../data/dma';

class MapDmaListWithData extends Component {
  state = {
    dmas: [],
  };
  getDmaData = ({ dataProvider, parentDmaId, excludeIds, deep }) => {
    getDmaList({ dataProvider, parentDmaId, excludeIds, deep }).then(dmas => {
      if (!excludeIds || (excludeIds.length == 0 && this.props.onCenterChange && dmas && dmas.length > 0)) {
        this.props.onCenterChange(dmas[0].center);
      }
      if (!this.unmount) {
        if (this.props.onDmasChange) {
          this.props.onDmasChange(dmas);
        }
        // console.log('dmas', deep, dmas);
        this.setState({ dmas });
      }
    });
  };
  componentDidMount() {
    // console.log('MapDmaListWithData', this.props);
    this.getDmaData(this.props);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.parentDmaId !== this.props.parentDmaId) {
      this.getDmaData(this.props);
    }
  }
  componentWillUnmount() {
    this.unmount = true;
  }
  render() {
    const { parentDmaId, mapitemprops = {} } = this.props;
    return <MapDmaList {...this.state} mapitemprops={{ parentDmaId, ...mapitemprops }} />;
  }
}
MapDmaListWithData.propTypes = {
  mapitemprops: PropTypes.object,
  dataProvider: PropTypes.func.isRequired,
  parentDmaId: PropTypes.string,
  onDmasChange: PropTypes.func,
  excludeIds: PropTypes.array,
  onCenterChange: PropTypes.func,
  deep: PropTypes.number,
};
MapDmaListWithData.defaultProps = {
  parentDmaId: '',
  deep: 1,
  excludeIds: [],
};

export default MapDmaListWithData;
