import React, { PureComponent } from 'react';
import { GisRightSide, GisLeftSide, GisDrawer } from 'web-common';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { MAP } from 'react-google-maps/lib/constants';
import GisActiveList from './GisActiveList';
import { FullScreen } from 'ra-loopback3';

export default class GisDesign extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    match: PropTypes.object,
  };
  state = {
    drawer: 'watersourcegroup',
  };
  drawerFinish = () => {
    // this.setState({ drawer: '' });
  };
  map = null;
  onMapReady = mapInstance => {
    if (!mapInstance) return;
    this.map = get(mapInstance, `context['${MAP}']`);
    this.map.data.setStyle(function(feature) {
      var ascii = feature.getProperty('ascii');
      var color = ascii > 91 ? 'red' : 'blue';
      return {
        fillColor: color,
        strokeWeight: 1,
      };
    });
    this.map.data.setStyle({
      fillColor: 'green',
      strokeWeight: 3,
    });
    this.map.data.addListener('mouseover', function(event) {
      this.map.data.remove(event.feature);
    });
  };

  render() {
    const { title } = this.props;
    const { drawer } = this.state;
    return (
      <FullScreen>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
          <GisLeftSide title={title} />
          <GisRightSide>
            <MapRenderWithConfig
              options={{
                minHeight: '800px',
                height: '100%',
                flex: 1,
                fullscreenControl: false,
                center: { lat: -28, lng: 137 },
              }}
              defaultZoom={4}
              refMap={this.onMapReady}
            />
          </GisRightSide>
          {drawer && <GisDrawer map={this.map} drawerFinish={this.drawerFinish} />}
        </div>
        <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
          <GisActiveList {...this.props} resource="watersourcegroups" />
        </div>
      </FullScreen>
    );
  }
}
