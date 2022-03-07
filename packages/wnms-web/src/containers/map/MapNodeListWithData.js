import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapNodeList } from 'ra-loopback3';
import geolib from 'geolib';
import { getNodeList } from '../../data/node';

class MapNodeListWithData extends Component {
  state = {
    nodes: [],
  };

  getData = ({ dataProvider, center }) => {
    if (!center) return;
    getNodeList({ dataProvider, center }).then(nodes => {
      this.setState({ nodes });
    });
  };

  componentDidMount() {
    this.getData(this.props);
  }

  componentDidUpdate(prevProps) {
    const { center, reloadDistance } = this.props;
    if (!center) {
      if (this.state.nodes.length > 0) {
        this.setState({ nodes: [] });
      }
      return;
    } else if (prevProps.center) {
      // calculate center distance with previous
      let distance = geolib.getDistance(
        { latitude: prevProps.center.lat, longitude: prevProps.center.lng },
        { latitude: center.lat, longitude: center.lng },
      );
      if (distance < reloadDistance) {
        return; // not reload data
      }
    }
    this.getData(this.props);
  }

  render() {
    const { mapitemprops } = this.props;
    return <MapNodeList {...this.state} mapitemprops={mapitemprops} />;
  }
}
MapNodeListWithData.propTypes = {
  mapitemprops: PropTypes.object,
  dataProvider: PropTypes.func.isRequired,
  center: PropTypes.object,
  reloadDistance: PropTypes.number,
};
MapNodeListWithData.defaultProps = {
  reloadDistance: 1000, // 1000 meter
};

export default MapNodeListWithData;
