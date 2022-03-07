import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { CustomPage, withDataProvider, CUSTOM, translate } from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
// import { KmlLayer } from 'react-google-maps';
import { debounce, get } from 'lodash';
// import queryString from 'query-string';
import MapRenderWithConfig from '../../containers/map/MapRenderWithConfig';
// import MapFactory from '../../containers/map/MapFactory';
import MaterialTree from './MaterialTree';
import { MAP } from 'react-google-maps/lib/constants';
// import isEqual from 'lodash/isEqual';
// import { withScriptjs, withGoogleMap, GoogleMap, Marker, KmlLayer } from 'react-google-maps';
// import moment from 'moment-timezone';
import { iconToMap } from '../../styles/Icons';

class MaterialOnMap extends Component {
  refMap = React.createRef();

  // luu cac geo sau khi render tren map, de remove
  globalGeo = {
    Valve: { geos: [] },
    Pipe: { geos: [] },
    Other: { geos: [] },
    Tank: { geos: [] },
    PressureReducing: { geos: [] },
    Filter: { geos: [] },
    QualityLogger: { geos: [] },
    Pump: { geos: [] },
    FlowLogger: { geos: [] },
    Factory: { geos: [] },
    Meter: { geos: [] },
    ElectricLogger: { geos: [] },
  };

  constructor(props) {
    super(props);
    const defaultState = this.getDefaultState();
    const { showOnMap } = defaultState;
    this.state = {
      treeMaterials: [],
      showOnMap: showOnMap || {
        Pipe: true,
      },
      mapKmls: {},
      factoryCount: 0,
      screen: 'materialOnMap',
      logger: {},
      data: {
        Valve: { json: {} },
        Pipe: { json: {} },
        Other: { json: {} },
        Tank: { json: {} },
        PressureReducing: { json: {} },
        Filter: { json: {} },
        QualityLogger: { json: {} },
        Pump: { json: {} },
        FlowLogger: { json: {} },
        Factory: { json: {} },
        Meter: { json: {} },
        ElectricLogger: { json: {} },
      },
    };
  }

  async componentDidMount() {
    const { showOnMap } = this.state;
    this.props.dataProvider(CUSTOM, 'materialuses', { subUrl: 'tree' }).then(res => {
      if (res.data) {
        this.setState({ treeMaterials: res.data });
      }
    });
    let types = [];
    Object.keys(showOnMap).map(type => {
      if (showOnMap[type]) {
        types.push(type);
      }
    });

    for (let type in this.state.showOnMap) {
      if (showOnMap[type]) {
        let data = await this.getGeoJson(type, true);
        await this.renderMats(data, type);
      }
    }
  }

  getGeoJson = async type => {
    let { data } = this.state;
    let tmp = { ...data };
    let res = await this.props.dataProvider(CUSTOM, 'materialuses/getGeoJsonMat', {
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

  // handleShowMap = type => {
  //   const { showOnMap, mapKmls } = this.state;
  //   let newState = !showOnMap[type];
  //   if (newState) {
  //     this.getKmls([type]);
  //   } else {
  //     delete mapKmls[type];
  //   }
  //   let fixShowOnMap = { ...showOnMap };
  //   fixShowOnMap[type] = newState;
  //   this.setState({ showOnMap: fixShowOnMap, mapKmls });
  // };

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

  getKmls = types => {
    const { mapKmls } = this.state;
    types.map(type => {
      this.props.dataProvider(CUSTOM, 'maps', { subUrl: 'kml', query: { type } }).then(res => {
        mapKmls[type] = res.data;
        this.setState({ mapKmls });
      });
    });
  };

  onFactoryChange = factories => {
    const { treeMaterials } = this.state;
    let factoryCount = factories ? factories.length : 0;
    let fixtree = treeMaterials || [];
    let factory = fixtree.filter(item => item.id === 'Factory');
    if (factory && factory[0]) {
      factory.value = { id: 'Factory', type: 'Factory', value: factoryCount || 0 };
    } else {
      fixtree.push({ id: 'Factory', type: 'Factory', value: factoryCount || 0 });
    }
    this.setState({ treeMaterials: [...fixtree] });
  };

  getDefaultState = () => {
    // const {
    //   location: { search },
    //   defaultState,
    // } = this.props;
    // if (search && search.length !== 0) {
    //   return JSON.parse(queryString.parse(search).state);
    // } else if (defaultState && !isEmpty(defaultState)) {
    //   return defaultState;
    // }
    return {};
  };
  getMap() {
    return get(this.refMap, `current.context['${MAP}']`);
  }

  getIcon = type => {
    if (type === 'Pipe') return null;
    let { theme } = this.props;
    let iconElement = `${type}Icon`;
    let urlIcon = iconToMap({ iconElement, color: theme.status.normal, formatType: 'svg' });
    return urlIcon;
  };

  renderMats = debounce(async (data, type) => {
    let { theme } = this.props;
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
            let health = feature.getProperty('health') || 'normal';
            let color = health ? theme.status[health.toLowerCase()] : null;
            return { strokeColor: color }; // , strokeWeight: 3
          } else {
            let urlIcon = iconToMap({ iconElement: `${mat}Icon`, color: theme.status.normal, formatType: 'svg' });
            return { icon: urlIcon.url };
          }
        });
        // save
        this.globalGeo[type].geos = res;
      }
    }
  }, 100);

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
    // console.log(this.refMap);

    return (
      <CustomPage title={'generic.pages.materialOnMap'} screen={screen}>
        {/* <CustomPageController screen={screen} state={{ showOnMap }} hasState> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={9} style={{ display: 'flex', flexDirection: 'row' }}>
            <MapRenderWithConfig refMap={this.refMap} options={{ minHeight: '800px', height: 'auto' }}>
              {/* {Object.keys(mapKmls).map(type => {
                  if (mapKmls[type] && mapKmls[type].data) {
                    return (
                      <KmlLayer key={mapKmls[type].id} url={mapKmls[type].data} options={{ preserveViewport: true }} />
                    );
                  }
                  return null;
                })} 
                <MapFactory onChange={this.onFactoryChange} />*/}
            </MapRenderWithConfig>
          </Grid>
          <Grid item xs={12} md={3}>
            <MaterialTree treeMaterials={treeMaterials} showOnMap={showOnMap} handleShowMap={this.handleShowMap} />
          </Grid>
        </Grid>
        {/* </CustomPageController> */}
      </CustomPage>
    );
  }
}

MaterialOnMap.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
  translate: PropTypes.func,
  defaultState: PropTypes.object,
};

const mapStateToProps = state => {
  const screenState = state.customPage['materialOnMap'];
  if (!screenState) return;
  return {
    defaultState: screenState.state,
  };
};

const enhance = compose(connect(mapStateToProps), withTheme, withDataProvider, translate);

export default enhance(MaterialOnMap);
