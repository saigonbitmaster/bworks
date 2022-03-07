import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage } from 'ra-loopback3';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import moment from 'moment-timezone';
import Filter from './Filter';
import ChartAndList from '../reportQuality/ChartAndList';

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
    loggerId: '',
    waterParameter: 'ntu',
  };

  constructor(props) {
    super(props);
    const { id } = props.match.params;
    this.state = {
      filterCommon: {},
      loggerId: id,
    };
  }
  refController = React.createRef();
  queryReport = filter => {
    filter.loggerId = this.state.loggerId;
    filter.flgSub = true;
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
            <Filter
              formName={'nms-sub-filter-report-quality-detail'}
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
              loggerId={this.state.loggerId}
            />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
ReportMain.propTypes = {
  title: PropTypes.string,
  match: PropTypes.object,
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
