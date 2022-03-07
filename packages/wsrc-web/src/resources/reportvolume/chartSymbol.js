import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage, withDataProvider, translate, CUSTOM } from 'ra-loopback3';
import moment from 'moment-timezone';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import BarChartVolume from './BarChartVolume';
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
  formRefFilter = React.createRef();
  defaultFilter = {
    timeRange: {
      type: 'month',
      from: moment()
        .subtract(6, 'month')
        .startOf('month')
        .toDate(),
      to: moment()
        .endOf('month')
        .toDate(),
    },
    sourceGroup: 'all',
    waterSource: 'all',
  };
  state = {
    chartData: [],
  };

  queryReport = filter => {
    // console.log('get data', filter, this.state.selectedWaterParam);
    if (!filter) return;
    let cloneFilter = Object.assign({}, filter);
    delete cloneFilter.sourceGroup;
    return this.statistic(cloneFilter);
  };

  statistic = async filter => {
    const { dataProvider } = this.props;
    let res = await dataProvider(CUSTOM, 'watersources', {
      method: 'get',
      subUrl: 'getDataChartStatisticVolume',
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
    const { chartData } = this.state;
    return (
      <CustomPage title={title}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <FilterReportWaterSource
              formName={'wsrc-filter-statistic-volume-chart'}
              queryReport={this.queryReport}
              typeTimes={['month']}
              defaultFilter={this.defaultFilter}
              flgMaterial={false}
              flgDetail={false}
              flgChart={true}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid item xs={12} sm={12}>
              <BarChartVolume data={chartData} />
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
