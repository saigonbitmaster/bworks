import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid, withTheme, withStyles } from '@material-ui/core';
import { withDataProvider, AuthView } from 'ra-loopback3';
import { compose } from 'recompose';
import { debounce } from 'lodash';
import QuantityStatisticWidget from './QuantityStatisticWidget';
import FlowLoggerStatisticWidget from './FlowLoggerStatisticWidget';
import FactoryStatisticWidget from './FactoryStatisticWidget';
import WaterLossStatisticWidget from './WaterLossStatisticWidget';
import config from '../../../Config';

const styles = () => ({
  gridItem: {
    display: 'flex',
    alignItems: 'stretch',
  },
});
class TopStatistic extends Component {
  state = { ready: false };
  componentDidMount() {
    this.delayRender();
  }
  delayRender = debounce(() => {
    this.setState({ ready: true });
  }, 1000);
  render() {
    const { ready } = this.state;
    const { classes } = this.props;
    return (
      <Grid container spacing={2}>
        {ready && (
          <Fragment>
            <Grid item sm={6} md={3} xs={12} className={classes.gridItem}>
              <AuthView permission={{ name: 'Dashboard', action: 'quantity' }} project={config.projectKey}>
                <QuantityStatisticWidget />
              </AuthView>
            </Grid>
            <Grid item sm={6} md={3} xs={12} className={classes.gridItem}>
              <AuthView permission={{ name: 'Dashboard', action: 'flowLogger' }} project={config.projectKey}>
                <FlowLoggerStatisticWidget />
              </AuthView>
            </Grid>
            <Grid item sm={6} md={3} xs={12} className={classes.gridItem}>
              <AuthView permission={{ name: 'Dashboard', action: 'waterLoss' }} project={config.projectKey}>
                <WaterLossStatisticWidget />
              </AuthView>
            </Grid>
            <Grid item sm={6} md={3} xs={12} className={classes.gridItem}>
              <AuthView permission={{ name: 'Dashboard', action: 'factory' }} project={config.projectKey}>
                <FactoryStatisticWidget />
              </AuthView>
            </Grid>
          </Fragment>
        )}
      </Grid>
    );
  }
}
TopStatistic.propTypes = {
  dataProvider: PropTypes.func,
  theme: PropTypes.object,
  classes: PropTypes.object,
};

const enhance = compose(withTheme, withStyles(styles), withDataProvider);
export default enhance(TopStatistic);
