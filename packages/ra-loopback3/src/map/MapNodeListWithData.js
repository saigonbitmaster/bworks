import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual, debounce } from 'lodash';
import geolib from 'geolib';
import { getNodeList } from '../data/node';
import MapNodeList from './MapNodeList';

class MapNodeListWithData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      center: props.center,
    };
  }
  componentDidMount() {
    this.updateData(this.props.center, this.props.excludeId, true);
  }
  componentDidUpdate() {
    if (!isEqual(this.props.center, this.state.center)) {
      this.updateData(this.props.center, this.props.excludeId);
    }
  }

  updateData = debounce((center, excludeId, force) => {
    let distance = geolib.getDistance(
      { latitude: center.lat, longitude: center.lng },
      { latitude: this.state.center.lat, longitude: this.state.center.lng },
    );
    // update node list
    if (force || distance > this.props.reloadDistance) {
      getNodeList({ dataProvider: this.props.dataProvider, center, excludeId }).then(nodes => {
        if (!this.unmount) {
          this.setState({ nodes, center });
        }
      });
    }
  }, this.props.debounceTime);

  render() {
    const { dataProvider, center, excludeId, debounceTime, reloadDistance, ...rest } = this.props;
    return <MapNodeList nodes={this.state.nodes} {...rest} />;
  }
}
MapNodeListWithData.propTypes = {
  dataProvider: PropTypes.func,
  center: PropTypes.object,
  excludeId: PropTypes.string,
  debounceTime: PropTypes.number,
  reloadDistance: PropTypes.number, // meter
};
MapNodeListWithData.defaultProps = {
  debounceTime: 200,
  reloadDistance: 1000, // m
  excludeId: '',
};

export default MapNodeListWithData;
