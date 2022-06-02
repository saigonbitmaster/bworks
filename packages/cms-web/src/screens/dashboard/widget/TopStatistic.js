import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, withTheme } from '@material-ui/core';
import { withDataProvider, translate } from 'ra-loopback3';
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
          <TotalSourceCapacity  {...this.props}/>
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <WaterSourceCount  {...this.props}/>
        </Grid>
        
        <Grid item sm={6} md={3} xs={12}>
          <WaterSourceStatistic {...this.props} />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <FactoryStatisticWidget  {...this.props} />
        </Grid>
      </Grid>
    );
  }
}
TopStatistic.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
  translate: PropTypes.func
};

const enhance = compose(translate, withTheme, withDataProvider);
export default enhance(TopStatistic);
