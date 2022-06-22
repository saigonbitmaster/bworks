import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, withTheme } from '@material-ui/core';
import { withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import PostedJobs from './postedJobs';
import BidJobs from './bidJobs';
import Fund from './fund';
import SmartContracts from './smartContracts';

class TopStatistic extends Component {
  componentDidMount() {}
  render() {
    const { theme } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item sm={6} md={3} xs={12}>
          <PostedJobs />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <BidJobs />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <SmartContracts />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <Fund />
        </Grid>
      </Grid>
    );
  }
}
TopStatistic.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
};

const enhance = compose(withTheme, withDataProvider);
export default enhance(TopStatistic);
