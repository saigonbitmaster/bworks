import React, { Component } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import {
  withDataProvider,
  CustomPage,
  FlexFormFilter,
  TimeRangeInput,
  GET_ONE,
  CardActions,
  Button,
  translate,
  CUSTOM,
  DateInput,
} from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import lodash from 'lodash';
import { BackIcon } from '../../styles/Icons';
import format from '../../util/format';
import SubChartFlowPressure from './SubChartFlowPressure';
import SubChartSumFlow from './SubChartSumFlow';

const styles = () => {
  return {
    paper: {
      height: 'auto',
    },
    widthFormGroup: { float: 'left', paddingRight: '8px' },
  };
};
class StatisticFlowLogger extends Component {
  defaultFilterStatistic = {
    type: 'hour',
    from: moment()
      .startOf('day')
      .toDate(),
    to: moment()
      .endOf('day')
      .toDate(),
  };
  constructor(props) {
    super(props);
    const { id } = props.match.params;

    this.state = {
      // loggerId: '5c6e1258ec4303014efcafd1', // test
      loggerId: id,
      logger: null,

      filterStatistic: this.defaultFilterStatistic,
      dataSumFlow: [], // tong luu luong
      dataFlowPressure: [], // luu luong/ap luc tuc thoi

      dayAccumulateFlow: new Date(), // ngay tich luy
      dataFlowAccumalate: {}, // data chi so tich luy
    };
  }

  componentDidMount() {
    this.props.dataProvider(GET_ONE, 'materialuses', { id: this.state.loggerId }).then(res => {
      if (res.data) {
        this.setState({ logger: res.data });
        let { type, from, to } = this.state.filterStatistic;
        if (type === 'hour') {
          this.loadDataFlowPressure(from);
        }
        this.loadDataSumFlow(type, from, to);
        this.loadDataFlowAccumulate(new Date());
      }
    });
  }
  // load chi so tich ly
  loadDataFlowAccumulate = day => {
    const { dataProvider } = this.props;
    let subUrl;
    let query = {};
    if (!this.state.logger) {
      return;
    }
    query.id = this.state.logger.id;
    subUrl = 'statisticSumFlowLoggerNow';
    query.day = moment(day).format();
    dataProvider(CUSTOM, 'materialuses', {
      subUrl,
      method: 'get',
      query,
    }).then(res => {
      if (res && res.data) {
        this.setState({ dataFlowAccumalate: res.data });
      } else {
        this.setState({ dataFlowAccumalate: {} });
      }
    });
  };
  // load data tong luu luong
  loadDataSumFlow = (type, from, to) => {
    const { dataProvider } = this.props;
    let subUrl;
    let query = {};
    if (!this.state.logger) {
      return;
    }
    query.id = this.state.logger.id;
    // console.log('loadDataSumFlow', type, moment(from).toDate(), moment(to).toDate());
    switch (type) {
      case 'hour': {
        subUrl = 'statisticSumFlowLoggerHour';
        query.day = from;
        break;
      }
      case 'day': {
        subUrl = 'statisticSumFlowLoggerDay';
        query.dayFrom = from;
        query.dayTo = to;
        break;
      }
      case 'month': {
        subUrl = 'statisticSumFlowLoggerMonth';
        query.startMonth = moment(from).format('YYYY-MM');
        query.endMonth = moment(to).format('YYYY-MM');
        break;
      }
      case 'year': {
        subUrl = 'statisticSumFlowLoggerYear';
        query.startYear = moment(from).format('YYYY');
        query.endYear = moment(to).format('YYYY');
        break;
      }
      default: {
        this.setState({ dataSumFlow: [] });
        break;
      }
    }

    dataProvider(CUSTOM, 'materialuses', {
      subUrl,
      method: 'get',
      query,
    }).then(res => {
      if (res && res.data && res.data.length) {
        this.setState({ dataSumFlow: res.data });
      } else {
        this.setState({ dataSumFlow: [] });
      }
    });
  };
  // load data luu luong, ap luc tuc thoi
  loadDataFlowPressure = day => {
    const { dataProvider } = this.props;
    let subUrl;
    let query = {};
    if (!this.state.logger) {
      return;
    }
    query.id = this.state.logger.id;
    subUrl = 'statisticRuntimeLoggerHour';
    query.day = day;
    query.isTimeStamp = true;
    dataProvider(CUSTOM, 'materialuses', {
      subUrl,
      method: 'get',
      query,
    }).then(res => {
      if (res && res.data && res.data.length) {
        this.setState({ dataFlowPressure: res.data });
      } else {
        this.setState({ dataFlowPressure: [] });
      }
    });
  };
  onChangeFilterChart = filter => {
    const time = { ...this.defaultFilterStatistic, ...(filter.time || {}) };
    this.setState({ filterStatistic: time });
    let { type, from, to } = time;
    if (type === 'hour') {
      this.loadDataFlowPressure(from);
    }
    this.loadDataSumFlow(type, from, to);
  };

  actions = () => {
    return (
      <CardActions>
        <Button label={this.props.translate('generic.back')} onClick={() => this.props.goBack()}>
          <BackIcon />
        </Button>
      </CardActions>
    );
  };
  onChangeFilterAccumulate = val => {
    const day = typeof val === 'string' ? moment(val, 'L') : moment(val);
    this.loadDataFlowAccumulate(day.endOf('date'));
  };
  render() {
    let CustomActions = this.actions;
    const { translate } = this.props;
    const { logger, filterStatistic, dataFlowPressure, dataSumFlow, dataFlowAccumalate } = this.state;
    const { type } = filterStatistic;
    // console.log('StatisticFlowLogger state', this.state);
    let textResultAccumulate = translate('generic.messages.hasNotDataLogger');
    if (dataFlowAccumalate && dataFlowAccumalate.logTime && dataFlowAccumalate.maxFlow) {
      textResultAccumulate = translate('generic.messages.notifyResultAccumulateFlow', {
        val1: moment(dataFlowAccumalate.logTime).format('HH:mm'),
        val2: moment(dataFlowAccumalate.logTime).format('DD/MM/YYYY'),
        val3: format.formatNumber(dataFlowAccumalate.maxFlow, 0),
      });
    }

    let nameLogger = lodash.get(logger, 'name', '');
    let optionKey = lodash.get(logger, 'optionKey', '');
    let fullNameLogger = `${nameLogger} - ${optionKey}`;
    return (
      <CustomPage title={nameLogger}>
        <Grid container spacing={2 * 2}>
          <Grid item xs={12} sm={12}>
            <CustomPage
              title={translate('generic.accumulateFlowDatalogger', { val: fullNameLogger })}
              card
              header
              actions={<CustomActions />}
            >
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <FlexFormFilter
                    formName="AccumulateFlowForm"
                    defaultValue={{ dayAccumulateFlow: new Date() }}
                    onChange={this.onChangeFilterAccumulate}
                  >
                    <DateInput date source="dayAccumulateFlow" label={translate('generic.typeTime.day')} />
                  </FlexFormFilter>
                </Grid>
                <Grid item xs={12} sm={12} style={{ paddingLeft: 15, paddingBottom: 15 }}>
                  {textResultAccumulate}
                </Grid>
              </Grid>
            </CustomPage>
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomPage title={translate('generic.chartFlowPressureDatalogger', { val: fullNameLogger })} card header>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <FlexFormFilter formName="FlowPressureForm" onChange={this.onChangeFilterChart}>
                    <TimeRangeInput
                      fullWidth
                      label={translate('generic.by')}
                      types={['hour', 'day', 'month', 'year']}
                      source={'time'}
                      defaultValue={this.defaultFilterStatistic}
                    />
                  </FlexFormFilter>
                </Grid>
                {type === 'hour' && (
                  <Grid item xs={12} sm={12}>
                    <SubChartFlowPressure data={dataFlowPressure} />
                  </Grid>
                )}
                <Grid item xs={12} sm={12}>
                  <SubChartSumFlow data={dataSumFlow} type={type} />
                </Grid>
              </Grid>
            </CustomPage>
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

StatisticFlowLogger.propTypes = {
  dataProvider: PropTypes.func,
  match: PropTypes.object,
  translate: PropTypes.func,
  goBack: PropTypes.func,
  // theme: PropTypes.object,
};
const enhance = compose(
  translate,
  withDataProvider,
  withStyles(styles),
  // withTheme,
  connect(null, { goBack }),
);
export default enhance(StatisticFlowLogger);
