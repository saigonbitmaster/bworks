import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CustomPage } from 'ra-loopback3';
import OverviewFactoryMonitor from './OverviewFactoryMonitor';
import OverviewDmaMonitor from './OverviewDmaMonitor';
import { Grid } from '@material-ui/core';

export default class OverviewMonitor extends Component {
  render() {
    const { title } = this.props;
    return (
      <CustomPage title={title}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <OverviewFactoryMonitor />
          </Grid>
          <Grid item xs={12}>
            <OverviewDmaMonitor />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

OverviewMonitor.propTypes = {
  title: PropTypes.string,
  dma: PropTypes.string,
};
