import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, withTheme } from '@material-ui/core';
import { withDataProvider, AuthView } from 'ra-loopback3';
import { compose } from 'recompose';
import Customers from './Customers';
import Revenue from './Revenue';
import WaterQuantity from './WaterQuantity';
import WaterLoss from './WaterLoss';

class TopStatistic extends Component {
  componentDidMount() {}
  render() {
    const { theme } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item sm={6} md={3} xs={12}>
          <AuthView permission={{ name: 'Dashboard', action: 'customer' }}>
            <Customers />
          </AuthView>
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <AuthView permission={{ name: 'Dashboard', action: 'revenue' }}>
            <Revenue />
          </AuthView>
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <AuthView permission={{ name: 'Dashboard', action: 'waterQuantity' }}>
            <WaterQuantity />
          </AuthView>
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <AuthView permission={{ name: 'Dashboard', action: 'waterLoss' }}>
            <WaterLoss />
          </AuthView>
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
