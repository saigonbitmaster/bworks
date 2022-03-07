import React, { Component, createElement, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CustomPage, withDataProvider, translate, Button, showNotification, CircularProgress } from 'ra-loopback3';
import { connect } from 'react-redux';
import { Save } from '@material-ui/icons';
import { compose } from 'recompose';
import clone from 'lodash/clone';
import get from 'lodash/get';
import grey from '@material-ui/core/colors/grey';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withStyles,
  ListItemSecondaryAction,
  CardActions,
  Switch,
  Divider,
} from '@material-ui/core';
import menu from '../../menu';

const useStyles = theme => ({
  nested: {
    marginLeft: theme.spacing(4),
    backgroundColor: grey[50],
  },
});

class PackageConfig extends Component {
  static propTypes = {
    dataProvider: PropTypes.func,
    showNotification: PropTypes.func,
    translate: PropTypes.func,
    title: PropTypes.string,
    classes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const cloneMenu = clone(menu.menu);
    cloneMenu.map(item => {
      if (item.menu && item.menu.length) {
        item.menu.map(subItem => {
          subItem.parentName = item.name;
        });
      }
    });
    cloneMenu.employeeApp = clone(menu.employeeApp);
    this.state = {
      menu: cloneMenu,
      menuCheck: {},
      saving: true,
    };
  }

  renderMenuItem = (item, translate, menuCheck, className) => {
    return (
      <ListItem button key={item.name + menuCheck[item.name]} className={className}>
        <ListItemIcon>{createElement(item.icon)}</ListItemIcon>
        <ListItemText inset primary={translate(item.label)} />
        <ListItemSecondaryAction>
          <Switch onChange={(e, val) => this.handleToggle(item, val)} checked={menuCheck[item.name]} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  componentDidMount() {
    const { dataProvider } = this.props;
    this.safeSetState({ saving: true });
    dataProvider('GET_ONE', 'PackageConfigs', { id: menu.projectKey })
      .then(res => {
        if (res.data && res.data.data) {
          this.safeSetState({ menuCheck: res.data.data });
        }
      })
      .finally(() => {
        this.safeSetState({ saving: false });
      });
  }

  safeSetState = state => {
    if (!this.unmount) {
      this.setState(state);
    }
  };

  componentWillUnmount() {
    this.unmount = true;
  }

  handleToggle = (item, val) => {
    const { menuCheck, menu } = this.state;
    if (get(menuCheck, `[${item.name}]`, false) !== val) {
      let status = {};
      status[item.name] = !menuCheck[item.name];

      // check parent menu
      const activeMenus = menu.filter(i => i.name === item.name);
      if (activeMenus && activeMenus.length) {
        const activeMenu = activeMenus[0];
        if (activeMenu && activeMenu.menu && activeMenu.menu.length) {
          activeMenu.menu.map(subItem => {
            status[subItem.name] = status[item.name];
          });
        }
      }
      if (status[item.name] && item.parentName) {
        status[item.parentName] = true;
      }

      const newMenuCheck = { ...menuCheck, ...status };
      this.safeSetState({ menuCheck: newMenuCheck });
    }
  };

  handleSave = () => {
    const { dataProvider, showNotification } = this.props;
    const { menuCheck } = this.state;
    dataProvider('CUSTOM', 'PackageConfigs', {
      subUrl: 'replaceOrCreate',
      method: 'POST',
      body: { id: menu.projectKey, data: menuCheck },
    })
      .then(res => {
        if (res.data) {
          showNotification('ra.notification.updated', 'info', { messageArgs: { smart_count: 1 } });
        }
      })
      .finally(() => {
        this.safeSetState({ saving: false });
      });
  };

  render() {
    const { title, translate } = this.props;
    const { menuCheck, menu, saving } = this.state;
    if (saving) {
      return <CircularProgress />;
    }

    return (
      <CustomPage
        title={title}
        header={true}
        card
        actions={
          <CardActions style={{ paddingRight: 10 }}>
            <Button
              primary="true"
              variant="raised"
              label={translate('ra.action.save')}
              saving={saving}
              onClick={this.handleSave}
              style={{ marginTop: '14px', marginLeft: '16px' }}
              permission={{ name: 'rolePermission', action: 'save' }}
            >
              <Save />
            </Button>
          </CardActions>
        }
      >
        <List component="nav">
          {menu.map(item => {
            if (item.master) return null;
            // console.log(item.name, menuCheck[item.name]);
            return (
              <Fragment key={item.name}>
                <Divider />
                {this.renderMenuItem(item, translate, menuCheck, null)}
                {/* {item.menu && item.menu.length && (
                  <List component="div" disablePadding>
                    {item.menu.map(subItem => {
                      return this.renderMenuItem(subItem, translate, menuCheck, classes.nested);
                    })}
                  </List>
                )} */}
              </Fragment>
            );
          })}
        </List>
      </CustomPage>
    );
  }
}

const enhance = compose(
  withDataProvider,
  translate,
  withStyles(useStyles),
  connect(null, { showNotification }),
)(PackageConfig);

export default enhance;
