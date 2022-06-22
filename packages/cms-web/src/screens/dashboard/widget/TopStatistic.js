import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, withTheme } from '@material-ui/core';
import { withDataProvider, translate } from 'ra-loopback3';
import { compose } from 'recompose';
import EmployerSum from './employerSum';
import JobSeekerSum from './jobSeekerSum';
import RevenueSum from './revenueSum';
import JobPostSum from './jobPostSum';

class TopStatistic extends Component {
  componentDidMount() {}
  render() {
    const { theme } = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item sm={6} md={3} xs={12}>
          <EmployerSum  {...this.props}/>
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <JobSeekerSum  {...this.props}/>
        </Grid>
        
        <Grid item sm={6} md={3} xs={12}>
          <JobPostSum {...this.props} />
        </Grid>
        <Grid item sm={6} md={3} xs={12}>
          <RevenueSum  {...this.props} />
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
