import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { CustomPage, withDataProvider, CUSTOM, translate } from 'ra-loopback3';
import { Grid, withTheme } from '@material-ui/core';
import TopStatistic from './widget/TopStatistic';
import Chart from './chart.js';

class Dashboard extends React.Component {
  state = { currentStatus: [], baseOnFlowLogger: false };
  componentDidMount() {}

  render() {
    return (
      <CustomPage title={'generic.pages.dashboard'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopStatistic {...this.props} />
          </Grid>

          <Grid item xs={12} md={12} style={{ display: 'flex' }}>
            <Chart />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

Dashboard.propTypes = {
  dataProvider: PropTypes.func.isRequired,
  theme: PropTypes.object,
  translate: PropTypes.func,
};

const enhance = compose(translate, withDataProvider, withTheme);

export default enhance(Dashboard);
