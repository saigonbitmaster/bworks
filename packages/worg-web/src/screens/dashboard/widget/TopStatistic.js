import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, withTheme } from '@material-ui/core';
import { withDataProvider } from 'ra-loopback3';
import { compose } from 'recompose';
import FactoryStatisticWidget from './FactoryStatisticSummary';
import WaterSourceSummary from './WaterSourceSummary';
import NmsStatisticSummary from './NmsStatisticSummary';
import CtmStatisticSummary from './CtmStatisticSummary';

class TopStatistic extends Component {
  componentDidMount() {}
  render() {
    const { theme } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item sm={6} md={3} xs={12}>
          <WaterSourceSummary />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <FactoryStatisticWidget />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <NmsStatisticSummary />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <CtmStatisticSummary />
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
