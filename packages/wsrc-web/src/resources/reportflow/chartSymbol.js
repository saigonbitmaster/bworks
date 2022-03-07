import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage, withDataProvider, translate, CUSTOM } from 'ra-loopback3';
import moment from 'moment-timezone';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import LoggerChartHour from './LoggerChartHour.js';
import LoggerChartDay from './LoggerChartDay.js';
import FilterReportWaterSource from '../../components/common/filter/FilterReportWaterSource';
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
    sourceGroup: 'all',
    waterSource: 'all',
  };

  state = {
    chartData: [],
  };

  queryReport = filter => {
    if (!filter) return;
    let cloneFilter = Object.assign({}, filter);
    delete cloneFilter.sourceGroup;
    return this.statistic(cloneFilter);
  };

  statistic = async filter => {
    const { dataProvider } = this.props;
    let res = await dataProvider(CUSTOM, 'watersources', {
      method: 'get',
      subUrl: 'getDataChartReportFlow',
      query: { filter: JSON.stringify(filter) },
    });

    this.safeSetState({
      chartType: filter.timeRange.type,
      chartData: res.data,
    });
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  safeSetState = state => {
    if (this.unmount) return;
    this.setState(state);
  };

  render() {
    const { title, theme } = this.props;
    const { chartData, chartType } = this.state;
    return (
      <CustomPage title={title}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <FilterReportWaterSource
              formName={'wsrc-filter-statistic-flow-chart'}
              queryReport={this.queryReport}
              typeTimes={['hour', 'day']}
              defaultFilter={this.defaultFilter}
              flgMaterial={false}
              flgDetail={false}
              flgChart={true}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Grid item xs={12} sm={12}>
              {chartData &&
                chartData.map(src =>
                  chartType === 'hour' ? (
                    <LoggerChartHour key={src.id} data={src} />
                  ) : (
                    <LoggerChartDay key={src.id} data={src} />
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
  theme: PropTypes.object,
  translate: PropTypes.func,
  title: PropTypes.string,
  classes: PropTypes.object,
  dataProvider: PropTypes.func,
  resource: PropTypes.string,
};
ChartSymbol.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(connect(null, {}), translate, withDataProvider, withTheme, withStyles(styles));

export default enhance(ChartSymbol);
