import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomPage, CustomPageController } from 'ra-loopback3';
// import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import moment from 'moment';
import PropTypes from 'prop-types';
import WaterLossByDma from './WaterLossByDma';
// import WaterLossByLevelPipe from './WaterLossByLevelPipe';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};

class WaterLoss extends Component {
  state = {
    filter: {
      typeTime: 'month',
      timeRange: {
        type: 'month',
        from: moment()
          .startOf('month')
          .subtract(13, 'month')
          .toDate(),
        to: moment()
          .startOf('month')
          // .subtract(1, 'month')
          .toDate(),
      },
      dmaId: 'AllDma',
      flgIncludeChild: false,
    },
    screen: 'waterLossByDma',
  };

  getFilter = filter => this.setState({ filter });

  render() {
    const { resource } = this.props;
    const { filter, screen } = this.state;
    return (
      <CustomPage title={'generic.pages.waterLoss'} screen={screen}>
        <CustomPageController resource={resource} filter={filter} screen={screen} hasFilter>
          <WaterLossByDma {...this.props} filter={filter} sendFilter={filters => this.getFilter(filters)} />
        </CustomPageController>
      </CustomPage>
    );
  }
}
WaterLoss.propTypes = {
  resource: PropTypes.any,
};
WaterLoss.detaultProps = {
  hasList: true,
  hasShow: true,
  hasCreate: false,
  hasEdit: false,
};

const enhance = compose(connect(null, {}), withStyles(styles));

export default enhance(WaterLoss);
