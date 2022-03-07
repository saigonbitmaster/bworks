import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage, withDataProvider, translate, CUSTOM } from 'ra-loopback3';
import moment from 'moment-timezone';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid, Typography, Card } from '@material-ui/core';
import LoggerChartHour from '../reportQuality/LoggerChartHour';
import LoggerChartDay from '../reportQuality/LoggerChartDay';
import Filter from './Filter';
const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    widthFormGroup: { float: 'left', paddingRight: '8px' },
  };
};
class ChartSymbol extends Component {
  formRefFilter = React.createRef();
  defaultFilter = {
    timeRange: {
      type: 'hour',
      from: moment()
        .startOf('day')
        .toDate(),
      to: moment()
        .endOf('day')
        .toDate(),
    },
    waterParameter: 'ntu',
  };

  constructor(props) {
    super(props);
    const { id } = props.match.params;
    this.state = {
      filterCommon: {},
      loggerId: id,
    };
    this.state = {
      chartType: 'hour',
      chartData: [],
      loggerId: id,
    };
  }

  queryReport = filter => {
    if (!filter) return;
    filter.loggerId = this.state.loggerId;
    filter.flgSub = true;
    return this.statistic(filter);
  };

  statistic = async filter => {
    const { dataProvider } = this.props;
    let res = await dataProvider(CUSTOM, 'materialuses', {
      method: 'get',
      subUrl: 'nmsGetDataChartReportQuality',
      query: { filter: JSON.stringify(filter) },
    });

    this.safeSetState({
      chartType: filter.timeRange.type,
      chartData: res.data,
      selectedParamSymbol: filter.waterParameter,
    });
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  safeSetState = state => {
    if (this.unmount) return;
    this.setState(state);
  };
  noFind = () => {
    return (
      <Card>
        <Typography style={{ padding: 20, height: 100 }} variant="body1">
          {this.props.translate('generic.noFind')}
        </Typography>
      </Card>
    );
  };
  render() {
    const { title } = this.props;
    const { chartData, chartType, selectedParamSymbol } = this.state;
    let NoFind = this.noFind;
    return (
      <CustomPage title={title}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Filter
              formName={'nms-sub-filter-report-quality-chart'}
              queryReport={this.queryReport}
              typeTimes={['hour', 'day']}
              defaultFilter={this.defaultFilter}
              flgDetail={false}
              flgChart={true}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Grid item xs={12} sm={12}>
              {chartData.length === 0 && <NoFind />}
              {chartData &&
                chartData.map(src =>
                  chartType === 'hour' ? (
                    <LoggerChartHour key={src.id} data={src} symbol={selectedParamSymbol.toLowerCase()} />
                  ) : (
                    <LoggerChartDay key={src.id} data={src} symbol={selectedParamSymbol.toLowerCase()} />
                  ),
                )}
            </Grid>
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
ChartSymbol.propTypes = {
  // theme: PropTypes.object,
  translate: PropTypes.func,
  title: PropTypes.string,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  resource: PropTypes.string,
  match: PropTypes.object,
};
ChartSymbol.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(
  connect(null, {}),
  translate,
  withDataProvider,
  // withTheme,
  withStyles(styles),
);

export default enhance(ChartSymbol);
