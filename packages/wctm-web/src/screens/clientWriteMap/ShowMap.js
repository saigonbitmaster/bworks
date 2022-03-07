import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withTheme } from '@material-ui/core';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import { mapStyles } from 'ra-loopback3';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import MarkerClient from '../../containers/map/MarkerClient';
import MapClientDescription from './MapClientDescription';
import computeClusterClassByStatus from '../../util/computeClusterClassByStatus';

class ShowMap extends Component {
  render() {
    const { data = [], centerPointGeo, zoomLevel, statisticClient, selectedStatus } = this.props;
    // console.log('show map', this.props);
    return (
      <MapRenderWithConfig
        refMap={this.refMap}
        options={{ minHeight: '800px', height: 'auto', styles: mapStyles.simplified }}
        centerPointGeo={centerPointGeo}
        zoomLevel={zoomLevel}
      >
        <MarkerClusterer
          key={data && data[0] ? `${data[0].status}` : 'null'}
          calculator={markers => computeClusterClassByStatus(markers, { true: 0, false: 2 })}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {data.map(item => {
            let pathIcon;
            let stylePopup = {};
            switch (item.status) {
              case true: {
                // da ghi nuoc
                pathIcon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
                stylePopup.color = 'blue';
                break;
              }
              case false: {
                // chua ghi nuoc
                pathIcon = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
                stylePopup.color = 'orange';
                break;
              }
              default:
                return null;
            }
            return <MarkerClient key={item._id} infoClient={item} pathIcon={pathIcon} stylePopup={stylePopup} />;
          })}
        </MarkerClusterer>

        <MapClientDescription selectedStatus={selectedStatus} data={statisticClient} />
      </MapRenderWithConfig>
    );
  }
}

ShowMap.propTypes = {
  data: PropTypes.array,
  theme: PropTypes.object,
  centerPointGeo: PropTypes.object,
  zoomLevel: PropTypes.number,
  getCenterMap: PropTypes.func,
  debounceTime: PropTypes.number,
  statisticClient: PropTypes.array,
  selectedStatus: PropTypes.bool,
};
ShowMap.defaultProps = {
  debounceTime: 1000,
};
const enhance = compose(withTheme);
export default enhance(ShowMap);
