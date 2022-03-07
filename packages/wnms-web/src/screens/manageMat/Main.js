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
import { MatStockIcon, MatExportIcon, MatUseIcon } from '../../styles/Icons';
import ListMatStock from './ListMatStock';
import ListMatExport from './ListMatExport';
import ListMatUse from './ListMatUse';
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
    value: get(this.props.tabIndex, 'tab', 0),
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.change(this.props.formname, 'tab', value); // save tab index to redux
  };

  render() {
    const { value } = this.state;
    const { classes, theme, translate, change, ...rest } = this.props;
    // console.log('render main props', this.props);
    // console.log('render main state', this.state);
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
              <Tab label={translate('resources.materialstocks.titleList')} icon={<MatStockIcon />} />
              <Tab label={translate('resources.materialexports.titleList')} icon={<MatExportIcon />} />
              <Tab label={translate('resources.materialuses.titleList')} icon={<MatUseIcon />} />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <Grid item xs={12} md={12}>
              <ListMatStock sub={true} {...rest} />
            </Grid>
          )}
          {value === 1 && (
            <Grid item xs={12} md={12}>
              <ListMatExport sub={true} {...rest} />
            </Grid>
          )}
          {value === 2 && (
            <Grid item xs={12} md={12}>
              <ListMatUse sub={true} {...rest} />
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
    formname: 'save-tab-form',
    tabIndex: getFormValues('save-tab-form')(state),
  };
}
const enhance = compose(translate, withStyles(styles), connect(mapStateToProps, { change }));
export default enhance(Main);
