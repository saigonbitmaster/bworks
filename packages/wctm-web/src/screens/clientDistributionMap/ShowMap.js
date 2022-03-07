import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withTheme } from '@material-ui/core';
import { mapStyles } from 'ra-loopback3';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import MarkerClient from '../../containers/map/MarkerClient';
import computeClusterClassByStatus from '../../util/computeClusterClassByStatus';
import MapClientDescription from './MapClientDescription';

// const circleIconActive = {
//   path: 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0',
//   fillColor: 'blue',
//   fillOpacity: 1,
//   scale: 0.5,
//   strokeColor: '#333',
//   strokeWeight: 2,
// };
// const circleIconPause = {
//   path: 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0',
//   fillColor: 'orange',
//   fillOpacity: 1,
//   scale: 0.5,
//   strokeColor: '#333',
//   strokeWeight: 2,
// };
// const circleIconStop = {
//   path: 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0',
//   fillColor: 'red',
//   fillOpacity: 1,
//   scale: 0.5,
//   strokeColor: '#333',
//   strokeWeight: 2,
// };
class ShowMap extends Component {
  // refMap = React.createRef;

  // getCenterMap = debounce(() => {
  //   let center = this.refMap.current.getCenter();
  //   const latitude = center.lat();
  //   const longitude = center.lng();
  //   this.props.getCenterMap({ latitude, longitude });
  // }, this.props.debounceTime);

  render() {
    const { data = [], zoomLevel, statisticClient, centerPointGeo, selectedStatus } = this.props;

    return (
      <MapRenderWithConfig
        refMap={this.refMap}
        options={{ minHeight: '800px', height: 'auto', styles: mapStyles.simplified }}
        centerPointGeo={centerPointGeo}
        zoomLevel={zoomLevel}
      >
        <MarkerClusterer
          key={data && data[0] ? data[0].status : 'null'}
          calculator={markers => computeClusterClassByStatus(markers, { ACTIVE: 0, PAUSE: 2, STOP: 3 })}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {data.map(item => {
            let pathIcon;
            let stylePopup = {};
            switch (item.status) {
              case 'ACTIVE': {
                pathIcon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
                stylePopup.color = 'blue';
                break;
              }
              case 'PAUSE': {
                pathIcon = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
                stylePopup.color = 'orange';
                break;
              }
              case 'STOP': {
                pathIcon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
                stylePopup.color = 'red';
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
  statisticClient: PropTypes.array,
  theme: PropTypes.object,
  centerPointGeo: PropTypes.object,
  zoomLevel: PropTypes.number,
  getCenterMap: PropTypes.func,
  debounceTime: PropTypes.number,
  selectedStatus: PropTypes.bool,
};

ShowMap.defaultProps = {
  debounceTime: 1000,
};

const enhance = compose(withTheme);
export default enhance(ShowMap);
