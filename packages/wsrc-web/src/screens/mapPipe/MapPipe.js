import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { CustomPage, withDataProvider, CUSTOM, translate } from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
import { debounce, get } from 'lodash';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
import Tree from './Tree';
import { MAP } from 'react-google-maps/lib/constants';

class MapPipe extends Component {
  refMap = React.createRef();

  // luu cac geo sau khi render tren map, de remove
  globalGeo = {
    WaterSource: { geos: [] },
    Pipe: { geos: [] },
    Factory: { geos: [] },
    Pump: { geos: [] },
    Meter: { geos: [] },
    Sensor: { geos: [] },
    DataLogger: { geos: [] },
  };

  constructor(props) {
    super(props);
    this.state = {
      treeMaterials: [],
      showOnMap: {
        Pipe: true,
        Factory: false,
        WaterSource: false,
        Pump: false,
        Sensor: false,
        DataLogger: false,
        Meter: false,
      },
      data: {
        WaterSource: { json: {} },
        Pipe: { json: {} },
        Factory: { json: {} },
        Pump: { json: {} },
        Sensor: { json: {} },
        DataLogger: { json: {} },
        Meter: { json: {} },
      },
    };
  }

  async componentDidMount() {
    const { showOnMap } = this.state;
    this.props.dataProvider(CUSTOM, 'watersources', { subUrl: 'tree' }).then(res => {
      if (res.data) {
        this.setState({ treeMaterials: res.data });
      }
    });

    for (let type in this.state.showOnMap) {
      if (showOnMap[type]) {
        let data = await this.getGeoJson(type);
        await this.renderMats(data, type);
      }
    }
  }

  getGeoJson = async type => {
    let { data } = this.state;
    let tmp = { ...data };
    let res = await this.props.dataProvider(CUSTOM, 'watersources/getGeoJsonMat', {
      query: { filter: JSON.stringify({ type }) },
    });

    if (res && res.data) {
      tmp[type].json = res.data;
      return tmp;
    } else {
      tmp[type].json = {};
    }
    return tmp;
  };

  handleShowMap = async type => {
    const { showOnMap } = this.state;
    let newState = !showOnMap[type];
    let fixShowOnMap = { ...showOnMap };
    fixShowOnMap[type] = newState;
    this.setState({ showOnMap: fixShowOnMap });
    if (newState) {
      let data = await this.getGeoJson(type);
      await this.renderMats(data, type);
    } else {
      this.removeGeo(this.globalGeo[type].geos, type);
    }
  };

  getDefaultState = () => {
    return {};
  };
  getMap() {
    return get(this.refMap, `current.context['${MAP}']`);
  }

  renderMats = debounce(async (data, type) => {
    if (!data) {
      return;
    }
    // console.log('render mat', type, data);
    const map = this.getMap();
    if (map) {
      let item = data[type];
      let { json } = item;
      if (Object.keys(json).length) {
        let res = map.data.addGeoJson(json);
        if (!res) {
          return;
        }
        map.data.setStyle(function(feature) {
          let mat = feature.getProperty('type');
          if (mat === 'Pipe') {
            // let health = feature.getProperty('health');
            let color = '#f44336'; // health ? this.props.theme.status[health.toLowerCase()] : null;
            return { strokeColor: color };
          } else {
            let urlIcon = `/api/Icons/dropView/${mat}Icon?size=64&status=${'normal'}`;
            return { icon: urlIcon };
          }
        });
        // save
        this.globalGeo[type].geos = res;
      }
    }
  }, 300);

  removeGeo = (geos, type) => {
    const map = this.getMap();
    if (geos && geos.length && map) {
      for (let i = 0; i < geos.length; i++) {
        let onceGeo = geos[i];
        map.data.remove(onceGeo);
      }
      this.globalGeo[type].geos = []; // remove
    }
  };
  render() {
    // const { theme } = this.props;
    const { treeMaterials, showOnMap, screen } = this.state;
    return (
      <CustomPage title={'generic.pages.materialOnMap'} screen={screen}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9} style={{ display: 'flex', flexDirection: 'row' }}>
            <MapRenderWithConfig refMap={this.refMap} options={{ minHeight: '800px', height: 'auto' }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Tree treeMaterials={treeMaterials} showOnMap={showOnMap} handleShowMap={this.handleShowMap} />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

MapPipe.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
  translate: PropTypes.func,
  defaultState: PropTypes.object,
};

const mapStateToProps = state => {
  const screenState = state.customPage['MapPipe'];
  if (!screenState) return;
  return {
    defaultState: screenState.state,
  };
};

const enhance = compose(connect(mapStateToProps), withTheme, withDataProvider, translate);

export default enhance(MapPipe);
