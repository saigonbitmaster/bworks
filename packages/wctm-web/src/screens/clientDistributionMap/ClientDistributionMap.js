import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  CustomPage,
  FlexFormFilter,
  withDataProvider,
  translate,
  ReferenceInput,
  SelectInput,
  CUSTOM,
  TextInput,
} from 'ra-loopback3';
import { Grid, Card, CardContent, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import geolib from 'geolib';
import has from 'lodash/has';
import debounce from 'lodash/debounce';
import intersectionBy from 'lodash/intersectionBy';
import { change } from 'redux-form';
import config from '../../Config';
import ShowMap from './ShowMap';
const styles = () => ({
  condition: {
    margin: 0,
    padding: '0 !important',
  },
});

class ClientDistributionMap extends Component {
  formRef = React.createRef();

  state = {
    provinceId: '',
    districtId: '',
    wardId: '',
    data: [],
    filteredData: [],
    statisticClient: [],
    centerPointGeo: {},
    DEFAULT_STATUS: 'ACTIVE',
    clientStatus: config.client.statusChoices.filter(({ id }) => id),
    zoomLevel: config.mapConfigZoomLevel.province,
    lastFetchCenter: null,
  };

  componentDidMount() {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'ctmconfigs', {
      filter: {
        where: { id: 'MapDefaultCenter' },
      },
    }).then(res => {
      if (res && res.data && res.data.length === 1) {
        let item = res.data[0].value;
        let coordinate = {
          latitude: item.lat,
          longitude: item.lng,
        };
        this.getData('', '', '', coordinate);
        this.countClient('', '', '');
        this.setState({ centerPointGeo: { lat: coordinate.latitude, lng: coordinate.longitude } });
      }
    });

    const { dispatch } = this.props;
    dispatch(change('formFilterClientDistributionMap', 'status', this.state.DEFAULT_STATUS));
  }

  getCenterMap = ({ latitude, longitude }) => {
    // console.log('>>>getCenterMap', { latitude, longitude });
    this.checkReloadCLient({ latitude, longitude });
  };

  checkReloadCLient = newCenter => {
    const { lastFetchCenter, provinceId, districtId, wardId } = this.state;
    if (!lastFetchCenter) {
      this.getData(provinceId, districtId, wardId, newCenter);
    } else {
      const { minReloadDistance } = this.props;
      let distance = geolib.getDistance(lastFetchCenter, newCenter);
      if (distance > minReloadDistance) {
        this.getData(provinceId, districtId, wardId, newCenter);
      } else {
        this.setState({ lastFetchCenter: newCenter });
      }
    }
  };

  // reloadClient = debounce((provinceId, districtId, wardId, { latitude, longitude }) => {
  //   const { dataProvider, maxDistance } = this.props;
  //   let cdt = {};
  //   if (provinceId) {
  //     cdt.provinceId = provinceId;
  //   }
  //   if (districtId) {
  //     cdt.districtId = districtId;
  //   }
  //   if (wardId) {
  //     cdt.wardId = wardId;
  //   }
  //   cdt.position = {
  //     near: { lat: latitude, lng: longitude },
  //     maxDistance,
  //     unit: 'meters',
  //   };
  //   console.log(cdt);
  //   dataProvider(CUSTOM, 'clients', {
  //     rawFilter: {
  //       // where: {
  //       //   position: {
  //       //     near: { lat: latitude, lng: longitude },
  //       //     maxDistance,
  //       //     unit: 'meters',
  //       //   },
  //       //   provinceId: '5bb58a51d1c950171e3c7aa1',
  //       // },
  //       where: cdt,
  //       fields: {
  //         id: true,
  //         name: true,
  //         formattedAddress: true,
  //         status: true,
  //         position: true,
  //       },
  //     },
  //   }).then(res => {
  //     console.log('>>>res', res);

  //     if (res && res.data) {
  //       this.setState({ data: res.data });
  //     }
  //   });
  // }, this.props.debounceReload);

  // count tat ca client co status: ['ACTIVE', 'STOP', 'PAUSE']
  countClient = (provinceId, districtId, wardId) => {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'clients', {
      subUrl: 'countClientStatusByGeo',
      query: {
        provinceId,
        districtId,
        wardId,
      },
    })
      .then(res => {
        // console.log('...res countClient', res.data);
        if (res && res.data && res.data.length) {
          this.setState({ statisticClient: res.data });
        }
      })
      .catch(() => {});
  };

  // get data to show map
  getData = (provinceId, districtId, wardId, { latitude, longitude }) => {
    if (!latitude || !longitude) {
      return;
    }
    let centerPoint = {
      lat: latitude,
      lng: longitude,
    };

    let { dataProvider, maxDistance } = this.props;

    dataProvider(CUSTOM, 'clients', {
      subUrl: 'getClientByGeo',
      query: {
        provinceId,
        districtId,
        wardId,
        centerPoint: JSON.stringify(centerPoint),
        maxDistance,
      },
    })
      .then(res => {
        // console.log('...res', res.data.length);
        if (res && res.data && res.data.length) {
          const data = res.data;
          const filteredData = res.data.filter(({ status }) =>
            status === has(this.state, 'newStatus') ? this.state.newStatus : this.state.DEFAULT_STATUS,
          );
          const preTextFilteredData = filteredData;
          this.setState({ data, filteredData, preTextFilteredData }, () => {
            if (has(this.state, 'filteredText')) {
              this.handleFilterClientByName(null, this.state.filteredText);
            }
          });
        }
      })
      .catch(() => {});
  };

  onChangeProvince = (e, val) => {
    let centerPoint = this.getCenterPointGeo('geoprovinces', val);
    this.getData(val, '', '', { latitude: centerPoint.lat, longitude: centerPoint.lng });
    this.countClient(val, '', '');

    this.setState({ provinceId: val, districtId: '', wardId: '' });
    this.formRef.current.props.change('districtId', '');
    this.formRef.current.props.change('wardId', '');

    this.changeCenterPointGeo(centerPoint, config.mapConfigZoomLevel.province);
  };

  onChangeDistrict = (e, val) => {
    let { provinceId } = this.state;
    let centerPoint = this.getCenterPointGeo('geodistricts', val);
    this.getData(provinceId, val, '', { latitude: centerPoint.lat, longitude: centerPoint.lng });
    this.countClient(provinceId, val, '');

    this.setState({ districtId: val, wardId: '' });
    this.formRef.current.props.change('wardId', '');

    this.changeCenterPointGeo(centerPoint, config.mapConfigZoomLevel.district);
  };

  onChangeWard = (e, val) => {
    let { provinceId, districtId } = this.state;
    let centerPoint = this.getCenterPointGeo('geowards', val);
    this.getData(provinceId, districtId, val, {
      latitude: centerPoint.lat,
      longitude: centerPoint.lng,
    });
    this.countClient(provinceId, districtId, val);

    this.setState({ wardId: val });
    this.changeCenterPointGeo(centerPoint, config.mapConfigZoomLevel.ward);
  };

  handleStatusChange = (_, val) => {
    const { data } = this.state;
    const filteredData = data.filter(({ status }) => status === val);
    const preTextFilteredData = filteredData;
    this.setState({ filteredData, preTextFilteredData, newStatus: val }, () => {
      if (has(this.state, 'filteredText')) {
        this.handleFilterClientByName(null, this.state.filteredText);
      }
    });
  };

  handleFilterClientByName = debounce((_, text) => {
    const { preTextFilteredData } = this.state;
    const { dataProvider } = this.props;
    if (text === '') {
      this.setState({ filteredData: preTextFilteredData, filteredText: text });
      return;
    }
    // Debounced
    // Request to database to find matching clients
    // Refilter the fetched data by matched client's id
    dataProvider(CUSTOM, 'Clients', {
      method: 'GET',
      fullUrl: true,
      query: {
        filter: JSON.stringify({
          where: { or: [{ name: { like: `${text}.*`, options: 'i' } }, { code: { like: `${text}.*`, options: 'i' } }] },
          fields: { id: true },
        }),
      },
    }).then(({ data }) => {
      const textFilteredData = data.map(datum => {
        datum._id = datum.id;
        delete datum.id;
        return datum;
      });
      const newFilteredData = intersectionBy(preTextFilteredData, textFilteredData, '_id');
      this.setState({ filteredData: newFilteredData, filteredText: text });
    });
  }, this.props.debounceReload);

  getCenterPointGeo = (key, val) => {
    // get center point
    if (key && val && this.props[key].data[val].position) {
      const position = this.props[key].data[val].position;
      return position;
    } else {
      return {};
    }
  };
  // changeCenterPointGeo = (key, val, zoomLevel) => {
  //   // get center point
  //   if (key && val && this.props[key].data[val].position) {
  //     const position = this.props[key].data[val].position;
  //     this.setState({ centerPointGeo: { lat: position.lat, lng: position.lng }, zoomLevel });
  //   } else {
  //     this.setState({ centerPointGeo: {}, zoomLevel });
  //   }
  //};
  changeCenterPointGeo = (pt, zoomLevel) => {
    this.setState({ centerPointGeo: pt, zoomLevel });
  };

  render() {
    // console.log('this.props', this.props);
    const { title, classes } = this.props;
    const {
      filteredData,
      clientStatus,
      statisticClient,
      centerPointGeo,
      zoomLevel,
      newStatus,
      DEFAULT_STATUS,
    } = this.state;
    return (
      <CustomPage rawTitle={title} header card>
        <Grid container>
          <Grid item xs={12}>
            <Card className={classes.condition}>
              <CardContent className={classes.condition}>
                <FlexFormFilter formName={'formFilterClientDistributionMap'} resource="clients" formRef={this.formRef}>
                  <Grid middle container spacing={2}>
                    <TextInput label={'generic.search'} onChange={this.handleFilterClientByName} />
                    <SelectInput
                      source="status"
                      choices={clientStatus}
                      style={{ marginLeft: '20px' }}
                      onChange={this.handleStatusChange}
                    />
                    <ReferenceInput
                      reference="geoprovinces"
                      source="provinceId"
                      style={{ marginLeft: '20px' }}
                      allowEmpty
                      onChange={this.onChangeProvince}
                      defaultValue={this.state.provinceId}
                    >
                      <SelectInput optionText="name" />
                    </ReferenceInput>
                    <ReferenceInput
                      reference="geodistricts"
                      source="districtId"
                      key={this.state.provinceId || 'district'}
                      filter={{ provinceId: this.state.provinceId || '' }}
                      allowEmpty
                      onChange={this.onChangeDistrict}
                      style={{ marginLeft: '20px' }}
                      defaultValue={this.state.districtId}
                    >
                      <SelectInput optionText="name" />
                    </ReferenceInput>
                    <ReferenceInput
                      reference="geowards"
                      source="wardId"
                      key={this.state.districtId || 'ward'}
                      filter={{ districtId: this.state.districtId || '' }}
                      allowEmpty
                      style={{ marginLeft: '20px' }}
                      onChange={this.onChangeWard}
                      defaultValue={this.state.wardId}
                    >
                      <SelectInput optionText="name" />
                    </ReferenceInput>
                  </Grid>
                </FlexFormFilter>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <ShowMap
              selectedStatus={newStatus === undefined ? DEFAULT_STATUS : newStatus}
              data={filteredData}
              statisticClient={statisticClient}
              centerPointGeo={centerPointGeo}
              zoomLevel={zoomLevel}
              getCenterMap={this.getCenterMap}
            />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
ClientDistributionMap.defaultProps = {
  minReloadDistance: 200, // meters
  debounceReload: 1000, // ms
  maxDistance: 10000000, // meters
};

ClientDistributionMap.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  dispatch: PropTypes.any,
  geodistricts: PropTypes.object,
  geowards: PropTypes.object,
  geoquarters: PropTypes.object,
  geoprovinces: PropTypes.object,

  minReloadDistance: PropTypes.number,
  debounceReload: PropTypes.number,
  maxDistance: PropTypes.number,
};

const mapStateToProps = state => {
  return {
    geodistricts: state.admin.resources.geodistricts,
    geowards: state.admin.resources.geowards,
    geoquarters: state.admin.resources.geoquarters,
    geoprovinces: state.admin.resources.geoprovinces,
  };
};

const enhance = compose(translate, withStyles(styles), withDataProvider, connect(mapStateToProps));

export default enhance(ClientDistributionMap);
