import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CustomPage, translate, withDataProvider } from 'ra-loopback3';
import { Grid, Paper } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { compose } from 'recompose';
import withMapDefaultConfig from '../../containers/map/MapDefaultConfig';
import MapDesignView from './MapDesignView';
import KmlList from './KmlList';

const styles = theme => {
  return {
    paper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  };
};
class Main extends Component {
  static propTypes = {
    basePath: PropTypes.string,
    options: PropTypes.object,
    match: PropTypes.object,
    classes: PropTypes.any,
    theme: PropTypes.object,
    defaultCenter: PropTypes.object,
    defaultZoom: PropTypes.number,
    translate: PropTypes.func,
    dataProvider: PropTypes.func.isRequired,
  };
  state = {
    flgRefesh: false,
  };
  refeshMap = () => {
    // console.log('main refeshMap');
    this.setState({ flgRefesh: true });
  };

  render() {
    const { classes, theme, translate, dataProvider, defaultCenter, defaultZoom, ...rest } = this.props;
    let mapOptions = {
      defaultCenter,
      defaultZoom,
    };
    // console.log('main render: ', this.props);
    return (
      <CustomPage title={'generic.pages.design'}>
        <Grid container spacing={2 * 2}>
          <Grid item xs={12} sm={12} md={6}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <KmlList {...rest} refeshMap={this.refeshMap} />
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <MapDesignView mapOptions={mapOptions} dataProvider={dataProvider} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </CustomPage>
    );
  }
}

const mapStateToProps = state => ({
  defaultZoom: state.design.defaultZoom,
  defaultCenter: state.design.defaultCenter,
});

const enhance = compose(
  withMapDefaultConfig,
  connect(mapStateToProps),
  withTheme,
  withStyles(styles),
  translate,
  withDataProvider,
);

export default enhance(Main);
