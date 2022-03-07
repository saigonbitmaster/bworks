import React, { Component } from 'react';
import { CustomPage } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import TopStatistic from './widget/TopStatistic';
import Chart from './chart';

class Dashboard extends Component {
  state = { showTopStatistic: false };

  componentDidMount() {
    this.setState({
      showTopStatistic: true,
    });
  }

  render() {
    const { showTopStatistic } = this.state;
    return (
      <CustomPage title="generic.pages.dashboard" header={false}>
        <Grid container>
          <Grid item xs={12}>
            {showTopStatistic && <TopStatistic />}
          </Grid>
          <Grid item xs={12}>
            <Chart />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

export default Dashboard;
