import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage } from 'ra-loopback3';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import moment from 'moment-timezone';
import Filter from './Filter';
// import ChartAndList from './ChartAndList';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};

class Detail extends Component {
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
    pumpStationId: 'all',
    pumpId: 'all',
    loggerId: 'all',
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

  render() {
    const { title } = this.props;
    return (
      <CustomPage title={title}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Filter
              formName={'nms-filter-electric-detail'}
              defaultFilter={this.defaultFilter}
              queryReport={this.queryReport}
              handlePrint={this.handlePrint}
              typeTimes={['hour', 'day', 'month', 'year']}
              flgDetail={true}
              flgChart={false}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            {/* <ChartAndList
              {...this.props}
              refChart={this.refChart}
              refController={this.refController}
              filter={this.state.filterCommon}
            /> */}
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
Detail.propTypes = {
  theme: PropTypes.object,
  title: PropTypes.string,
};
Detail.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(connect(null, {}), withTheme, withStyles(styles));

export default enhance(Detail);
