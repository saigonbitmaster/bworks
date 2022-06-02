import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, withTheme } from '@material-ui/core';
import { withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import TotalSourceCapacity from './totalSourceCapacity';
import WaterSourceCount from './waterSourceCount';
import FactoryStatisticWidget from './FactoryStatisticWidget';
import WaterSourceStatistic from './waterSourceStatistic';

class TopStatistic extends Component {
  componentDidMount() {}
  render() {
    const { theme } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item sm={6} md={3} xs={12}>
          <TotalSourceCapacity />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <WaterSourceCount />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <WaterSourceStatistic />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <FactoryStatisticWidget />
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
