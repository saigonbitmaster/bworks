import React, { Component } from 'react';
import { Grid, withTheme } from '@material-ui/core';
import { compose } from 'recompose';
import { AuthView } from 'ra-loopback3';
import PropTypes from 'prop-types';
import StatisticRevenue from './statisticRevenue';
import StatisticClientWriteWater from './statisticClientWriteWater';
import StatisticPayment from './statisticPayment';
import StatisticQuantityWater from './statisticQuantityWater';
class Chart extends Component {
  render() {
    // const { theme } = this.props;
    return (
      <Grid middle="true" container spacing={2}>
        <Grid middle="true" item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'statisticRevenue' }}>
            <StatisticRevenue />
          </AuthView>
        </Grid>
        <Grid middle="true" item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'statisticPayment' }}>
            <StatisticPayment />
          </AuthView>
        </Grid>
        <Grid middle="true" item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'statisticClientWriteWater' }}>
            <StatisticClientWriteWater />
          </AuthView>
        </Grid>
        <Grid middle="true" item xs={12} sm={6}>
          <AuthView permission={{ name: 'Dashboard', action: 'statisticQuantityWater' }}>
            <StatisticQuantityWater />
          </AuthView>
        </Grid>
      </Grid>
    );
  }
}

Chart.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
};

const enhance = compose(withTheme);
export default enhance(Chart);
