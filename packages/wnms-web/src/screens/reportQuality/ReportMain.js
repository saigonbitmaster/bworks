import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage } from 'ra-loopback3';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import moment from 'moment-timezone';
import FilterReportWaterSource from './FilterReportWaterSource';
import ChartAndList from './ChartAndList';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};

class ReportMain extends Component {
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
    dmaId: 'AllDma',
    loggerId: 'all',
    waterParameter: 'ntu',
  };
  state = {
    filterCommon: {},
  };

  refController = React.createRef();
  queryReport = filter => {
    // filter.selectedWaterParam = { id: filter.selectedWaterParam };
    this.setState({ filterCommon: filter });
    if (this.refController && this.refController.current) {
      this.refController.current.updateFilter();
    }
  };
  refChart = React.createRef();
  handlePrint = () => {
    this.refChart.current.handlePrint(this.state.filterCommon);
  };

  render() {
    const { title } = this.props;
    return (
      <CustomPage title={title}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <FilterReportWaterSource
              formName={'nms-filter-report-quality-detail'}
              defaultFilter={this.defaultFilter}
              queryReport={this.queryReport}
              handlePrint={this.handlePrint}
              hasPrint={false}
              typeTimes={['hour', 'day', 'month', 'year']}
              showWaterParameter={true}
              flgDetail={true}
              flgChart={false}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <ChartAndList
              {...this.props}
              refChart={this.refChart}
              refController={this.refController}
              filter={this.state.filterCommon}
            />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
ReportMain.propTypes = {
  theme: PropTypes.object,
  title: PropTypes.string,
};
ReportMain.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(
  connect(null, {}),
  // withTheme,
  withStyles(styles),
);

export default enhance(ReportMain);
