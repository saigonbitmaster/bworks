import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate, CustomPage } from 'ra-loopback3';
import { compose } from 'recompose';
import { Grid } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles/index';
import PropTypes from 'prop-types';
import config from '../../Config';
import ListMatStock from './ListMatStock';
import ListMatExport from './ListMatExport';
import ListMatUse from './ListMatUse';

const styles = theme => ({
  paper: {
    padding: theme.spacing(1),
  },
});

class ManageMat extends Component {
  render() {
    const { classes, theme, ...rest } = this.props;
    return (
      <CustomPage title={'generic.pages.dashboard'}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <ListMatStock {...rest} perPage={config.PER_PAGE_MANAGE_MATERIAL} className={classes.paper} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ListMatExport sub {...rest} perPage={config.PER_PAGE_MANAGE_MATERIAL} className={classes.paper} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ListMatUse sub {...rest} perPage={config.PER_PAGE_MANAGE_MATERIAL} className={classes.paper} />
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}
ManageMat.propTypes = {
  translate: PropTypes.func,
  classes: PropTypes.object,
  theme: PropTypes.object,
};
// eslint-disable-next-line
function mapStateToProps(state, props) {
  return {};
}

const enhance = compose(connect(mapStateToProps, {}), translate, withStyles(styles), withTheme);

export default enhance(ManageMat);
