import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { translate, CustomPage } from 'ra-loopback3';
import { Grid } from '@material-ui/core';
import { compose } from 'recompose';
import { getFormValues, change } from 'redux-form';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { LineChartIcon, DetailIcon } from '../../styles/Icons';
import Detail from './Detail';
import Chart from './Chart';
const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(1),
  },
});

class Main extends React.Component {
  state = {
    value: get(this.props.tabIndex, 'tab', 1),
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.change(this.props.formname, 'tab', value); // save tab index to redux
  };

  render() {
    const { value } = this.state;
    const { translate } = this.props;
    return (
      <CustomPage title={'generic.pages.dashboard'}>
        <Grid container>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleChange}
              variant="scrollable"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={translate('generic.tabDetail')} icon={<DetailIcon />} />
              <Tab label={translate('generic.tabChart')} icon={<LineChartIcon />} />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <Grid item xs={12} md={12}>
              <Detail />
            </Grid>
          )}
          {value === 1 && (
            <Grid item xs={12} md={12}>
              <Chart />
            </Grid>
          )}
        </Grid>
      </CustomPage>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  tabIndex: PropTypes.any,
  change: PropTypes.func,
  formname: PropTypes.any,
  theme: PropTypes.any,
  translate: PropTypes.func,
};
function mapStateToProps(state) {
  return {
    formname: 'save-tab-form-electric',
    tabIndex: getFormValues('save-tab-form-electric')(state),
  };
}
const enhance = compose(translate, withStyles(styles), connect(mapStateToProps, { change }));
export default enhance(Main);
