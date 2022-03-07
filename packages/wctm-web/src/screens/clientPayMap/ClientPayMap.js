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
  MonthInput,
  TextInput,
} from 'ra-loopback3';
import { Grid, Card, CardContent, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import geolib from 'geolib';
import debounce from 'lodash/debounce';
import has from 'lodash/has';
import intersectionBy from 'lodash/intersectionBy';
import { change } from 'redux-form';
import moment from 'moment-timezone';
import config from '../../Config';
import ShowMap from './ShowMap';

const styles = () => ({
  condition: {
    margin: 0,
    padding: '0 !important',
  },
});
class ClientPayMap extends Component {
  formRef = React.createRef();

  state = {
    time: moment().toDate(),
    provinceId: '',
    districtId: '',
    wardId: '',
    data: [],
    filteredData: [],
    paidStatus: config.client.payChoices,
    chosenPaidStatus: 'paid',
    centerPointGeo: {},
    zoomLevel: config.mapConfigZoomLevel.province,
    statisticClient: [],
    lastFetchCenter: null,
  };

  componentDidMount() {
    const { time } = this.state;
    const { dataProvider } = this.props;
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
        this.getData(moment().toDate(), '', '', '', coordinate);
        this.countClient(time, '', '', '');
        this.setState({ centerPointGeo: { lat: coordinate.latitude, lng: coordinate.longitude } });
      }
    });

    const { dispatch } = this.props;
    dispatch(change('formFilterClientPayMap', 'status', this.state.chosenPaidStatus));
  }
  getCenterMap = ({ latitude, longitude }) => {
    this.checkReloadCLient({ latitude, longitude });
  };

  checkReloadCLient = newCenter => {
    const { lastFetchCenter, provinceId, districtId, wardId, time } = this.state;
    if (!lastFetchCenter) return this.getData(time, provinceId, districtId, wardId, newCenter);
    const { minReloadDistance } = this.props;
    let distance = geolib.getDistance(lastFetchCenter, newCenter);
    if (distance > minReloadDistance) {
      this.getData(time, provinceId, districtId, wardId, newCenter);
    } else {
      this.setState({ lastFetchCenter: newCenter });
    }
  };

  countClient = (time, provinceId, districtId, wardId) => {
    let { dataProvider } = this.props;
    dataProvider(CUSTOM, 'clients', {
      subUrl: 'countClientByPay',
      query: {
        time,
        provinceId,
        districtId,
        wardId,
      },
    })
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ statisticClient: res.data });
        } else {
          this.setState({ statisticClient: [] });
        }
      })
      .catch(() => {});
  };

  getData = (time, provinceId, districtId, wardId, { latitude, longitude }) => {
    if (!latitude || !longitude) {
      return;
    }
    let centerPoint = {
      lat: latitude,
      lng: longitude,
    };
    let { dataProvider, maxDistance } = this.props;

    dataProvider(CUSTOM, 'clients', {
      subUrl: 'getClientByPay',
      query: {
        time,
        provinceId,
        districtId,
        wardId,
        centerPoint: JSON.stringify(centerPoint),
        maxDistance,
      },
    })
      .then(res => {
        if (res && res.data) {
          const data = res.data;
          const filteredData = res.data.filter(({ status }) => status === this.state.chosenPaidStatus);
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

  onChangeMonth = (e, val) => {
    let { provinceId, districtId, wardId, centerPointGeo } = this.state;
    this.getData(val, provinceId, districtId, wardId, { latitude: centerPointGeo.lat, longitude: centerPointGeo.lng });
    this.countClient(val, provinceId, districtId, wardId);

    this.setState({ time: val });
    //this.getData(val, this.state.provinceId, this.state.districtId, this.state.wardId);
  };

  onChangeProvince = (e, val) => {
    let { time } = this.state;
    let centerPoint = this.getCenterPointGeo('geoprovinces', val);
    this.getData(time, val, '', '', { latitude: centerPoint.lat, longitude: centerPoint.lng });
    this.countClient(time, val, '', '');

    this.setState({ provinceId: val, districtId: '', wardId: '' });
    this.formRef.current.props.change('districtId', '');
    this.formRef.current.props.change('wardId', '');
    // this.getData(this.state.time, val, '', '');

    this.changeCenterPointGeo(centerPoint, config.mapConfigZoomLevel.province);
  };

  onChangeDistrict = (e, val) => {
    let { time, provinceId } = this.state;
    let centerPoint = this.getCenterPointGeo('geodistricts', val);
    this.getData(time, provinceId, val, '', { latitude: centerPoint.lat, longitude: centerPoint.lng });
    this.countClient(time, provinceId, val, '');

    this.setState({ districtId: val, wardId: '' });
    this.formRef.current.props.change('wardId', '');
    // this.getData(this.state.time, this.state.provinceId, val, '');
    this.changeCenterPointGeo(centerPoint, config.mapConfigZoomLevel.district);
  };

  onChangeWard = (e, val) => {
    let { time, provinceId, districtId } = this.state;
    let centerPoint = this.getCenterPointGeo('geowards', val);
    this.getData(time, provinceId, districtId, val, {
      latitude: centerPoint.lat,
      longitude: centerPoint.lng,
    });
    this.countClient(time, provinceId, districtId, val);

    this.setState({ wardId: val });
    // this.getData(this.state.time, this.state.provinceId, this.state.districtId, val);
    this.changeCenterPointGeo(centerPoint, config.mapConfigZoomLevel.ward);
  };

  handleStatusChange = (_, value) => {
    const { data } = this.state;
    const filteredData = data.filter(({ status }) => status === value);
    const preTextFilteredData = filteredData;
    this.setState({ filteredData, preTextFilteredData, chosenPaidStatus: value }, () => {
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
    }).then(({ data: fetchedData }) => {
      const textFilteredData = fetchedData.map(datum => {
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

  changeCenterPointGeo = (pt, zoomLevel) => {
    this.setState({ centerPointGeo: pt, zoomLevel });
  };

  render() {
    const { title, classes } = this.props;
    const { filteredData, paidStatus, centerPointGeo, zoomLevel, statisticClient, chosenPaidStatus } = this.state;
    return (
      <CustomPage rawTitle={title} header card>
        <Grid container>
          <Grid item xs={12}>
            <Card className={classes.condition}>
              <CardContent className={classes.condition}>
                <FlexFormFilter
                  defaultValue={{ month: moment().toDate() }}
                  formName={'formFilterClientPayMap'}
                  resource="clients"
                  formRef={this.formRef}
                >
                  <Grid middle container spacing={2}>
                    <TextInput label="generic.search" onChange={this.handleFilterClientByName} />
                    <MonthInput
                      date
                      source={'month'}
                      onChange={this.onChangeMonth}
                      label={this.props.translate('generic.typeTime.month')}
                      style={{ marginLeft: '20px', width: '130px' }}
                    />
                    <SelectInput source="status" choices={paidStatus} onChange={this.handleStatusChange} />
                    <ReferenceInput
                      reference="geoprovinces"
                      source="provinceId"
                      allowEmpty
                      onChange={this.onChangeProvince}
                      style={{ marginLeft: '20px' }}
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
              selectedStatus={chosenPaidStatus}
              statisticClient={statisticClient}
              data={filteredData}
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
const mapStateToProps = state => {
  return {
    geodistricts: state.admin.resources.geodistricts,
    geowards: state.admin.resources.geowards,
    geoquarters: state.admin.resources.geoquarters,
    geoprovinces: state.admin.resources.geoprovinces,
  };
};
ClientPayMap.defaultProps = {
  minReloadDistance: 500, // meters
  debounceReload: 1000, // ms
  maxDistance: 10000000, // meters
};
ClientPayMap.propTypes = {
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
const enhance = compose(translate, withStyles(styles), withDataProvider, connect(mapStateToProps));
export default enhance(ClientPayMap);
