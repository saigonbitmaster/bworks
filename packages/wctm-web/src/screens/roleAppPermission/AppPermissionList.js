'use strict';
import React, { Component, Fragment } from 'react';
import {
  // Grid,
  Collapse,
  ListItem,
  Switch,
  ListItemText,
  ListItemIcon,
  CardActions,
  List,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  Divider,
  MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Save } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { translate, Button, GET_ONE, CUSTOM, withDataProvider, showNotification, CustomPage } from 'ra-loopback3';
import { connect } from 'react-redux';
import lodash from 'lodash';
import compose from 'recompose/compose';
import appMenu from '../../menu/employeeApp';
import config from '../../Config';
import { openParentPermissionScreen, createFlatList, buildTreeFromFlattenedObject } from './utils';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  firstNested: {
    paddingLeft: theme.spacing(4),
    backgroundColor: '#FAFAFA',
  },
  secondNested: {
    paddingLeft: theme.spacing(8),
    backgroundColor: '#EEEEEE',
  },
  switchLevel1: {},
  switchLevel2: {
    right: theme.spacing(4),
  },
  switchLevel3: {
    right: theme.spacing(8),
  },
});

@connect(null, { showNotification })
@withDataProvider
class AppPermissionList extends Component {
  state = {
    menu: [],
    levels: null,
    switchesStatus: null,
    nestedListNodes: [],
    selectedRole: '',
    availableRoles: null,
    availableAPIs: [],
    selectedAPIs: [],
    selectedScreens: {},
    saving: false,
  };

  handleClick = level => {
    if (this.state.levels[level]) {
      const closedChildren = {
        ...this.state,
        levels: {
          ...this.state.levels,
          ...lodash
            .keys(this.state.levels)
            .filter(key => key === level || key.startsWith(`${level}.`))
            .map(key => ({ [key]: false }))
            .reduce((acc, val) => ({ ...acc, ...val })),
        },
      };
      this.setState(() => closedChildren);
    } else {
      const newOpenState = { ...this.state, levels: { ...this.state.levels, [level]: !this.state.levels[level] } };
      this.setState(() => newOpenState);
    }
  };

  handleSwitch = (index, checked) => {
    let { availableAPIs, selectedAPIs, switchesStatus, selectedScreens } = { ...this.state };
    const filteredAPIs = Object.entries(availableAPIs).filter(([key]) => key === index || key.startsWith(`${index}`));
    if (checked) {
      // Extract `screen` property out of selected APIs
      // Remove duplicates
      // Save to state
      selectedAPIs = lodash.uniqBy(
        [
          ...selectedAPIs,
          ...filteredAPIs.map(([_, value]) => lodash.values(value)).reduce((acc, val) => [...acc, ...val], []), // eslint-disable-line
        ],
        ({ url, method, functionName, name }) => `${url}-${method}-${functionName}-${name}`,
      );
      const recentlySelectedScreen = lodash.merge(
        ...selectedAPIs.map(({ name, functionName }) => ({ [name]: { [functionName]: true } })),
      );
      selectedScreens = { ...selectedScreens, ...recentlySelectedScreen };
    } else {
      const deselectedAPIs = lodash.uniqBy(
        filteredAPIs.map(([_, value]) => lodash.values(value)).reduce((acc, val) => [...acc, ...val], []), // eslint-disable-line
        ({ url, method, functionName, name }) => `${url}-${method}-${functionName}-${name}`,
      );
      selectedAPIs = lodash.differenceWith(selectedAPIs, deselectedAPIs, lodash.isEqual);

      const recentlyDeselectedScreen = lodash.uniq(
        deselectedAPIs.map(({ name, functionName }) => `${name}.${functionName}`),
      );
      recentlyDeselectedScreen.forEach(path => lodash.unset(selectedScreens, path));
    }
    // Only turn on the parental button if its children are all checked
    lodash.set(switchesStatus, index, checked);
    this.setState({ selectedAPIs, selectedScreens, switchesStatus });
  };

  handleSelectRole = async event => {
    let { switchesStatus, levels } = { ...this.state };
    this.setState({ selectedRole: event.target.value });
    if (event.target.value) {
      await this.displayPermissionProfile(event.target.value);
    } else {
      // Turn off all switches
      // Close all options
      switchesStatus = lodash.mapValues(switchesStatus, () => false);
      levels = lodash.mapValues(levels, () => false);
      this.setState({ switchesStatus, levels });
    }
  };

  displayPermissionProfile = async role => {
    let { menu, switchesStatus, availableAPIs } = this.state;
    this.props
      .dataProvider(CUSTOM, 'AppUsers', {
        method: 'POST',
        subUrl: 'getPathsByRoleAndProject',
        fullUrl: true,
        body: { role, project: config.projectKey },
      })
      .then(({ data: { appMenu: permittedMenu = {} } }) => {
        const intersection = lodash.intersection(Object.keys(permittedMenu), menu);
        const tempSwitchesStatus = lodash.mapValues(switchesStatus, () => false);
        intersection.forEach(element => {
          const index = menu.indexOf(element);
          lodash.set(tempSwitchesStatus, index, true);
          this.handleSwitch(index, true);
        });

        this.setState({ switchesStatus: tempSwitchesStatus });
      });
  };

  handleSaveMatrix = () => {
    const { dataProvider, showNotification } = this.props;
    const { availableAPIs, selectedRole, selectedAPIs, nestedListNodes } = this.state;
    if (!selectedRole) {
      showNotification('error.rolepermissions.lackOfRole', 'warning');
      return;
    }
    if (selectedAPIs.length === 0) {
      showNotification('error.rolepermissions.lackOfSelectedAPIs', 'warning');
      return;
    }
    // De-duplicate selected APIs before persist to database
    const defaultAPIs = availableAPIs[nestedListNodes.length];
    let uniqueSelectedAPIs = [...selectedAPIs, ...defaultAPIs];
    uniqueSelectedAPIs = lodash.uniqWith(
      uniqueSelectedAPIs.map(({ method, url }) => ({ method, url })),
      lodash.isEqual,
    );

    this.setState({ saving: true });
    dataProvider(CUSTOM, 'AppUsers', {
      subUrl: 'setAppAccessForRole',
      fullUrl: true,
      method: 'POST',
      body: {
        project: config.projectKey,
        roleName: selectedRole,
        matrix: uniqueSelectedAPIs,
        menu: lodash.pickBy(this.state.selectedScreens, value => !lodash.isEmpty(value)),
      },
    })
      .then(() => showNotification('notification.rolepermissions.roleLockedSuccessful'))
      .catch(() => showNotification('error.INTERNAL_SERVER_ERROR', 'warning'))
      .finally(() => this.setState({ saving: false }));
  };

  componentDidMount() {
    this.props
      .dataProvider(GET_ONE, 'PackageConfigs', {
        id: config.appProjectKey,
      })
      .then(result => {
        // Filter out commercially non-permitted screens
        let currentScreens = lodash.get(result, 'data.data.menu', []);
        let nestedListNodes = createFlatList(currentScreens);
        const newLevels = nestedListNodes
          .map(({ index }) => ({ [index]: false }))
          .reduce((acc, val) => ({ ...acc, ...val }));
        const availableAPIs = nestedListNodes
          .map(({ access, index, name }) =>
            access.apis && name ? { [index]: access.apis.map(api => ({ ...api, name, functionName: name })) } : {},
          )
          .reduce((acc, val, index, scrArray) => {
            if (index + 1 === scrArray.length) {
              if (lodash.isEmpty(val)) {
                return {
                  ...acc,
                  [index]: [],
                  [index + 1]: appMenu.access.common.apis.map(api => ({
                    ...api,
                    name: 'common',
                    functionName: 'common',
                  })),
                };
              }
              return {
                ...acc,
                ...val,
                [index + 1]: appMenu.access.common.apis.map(api => ({
                  ...api,
                  name: 'common',
                  functionName: 'common',
                })),
              };
            }
            if (lodash.isEmpty(val)) {
              return { ...acc, [index]: [] };
            }
            return { ...acc, ...val };
          }, {});
        this.setState({
          nestedListNodes,
          menu: appMenu.screens,
          levels: newLevels,
          switchesStatus: { ...newLevels },
          availableAPIs,
        });
      });

    // Get available roles
    this.props
      .dataProvider(CUSTOM, 'Roles', {
        fullUrl: true,
        query: { filter: JSON.stringify({ where: { project: config.projectKey || 'ctm' } }) },
      })
      .then(({ data }) => {
        if (data) {
          this.setState({ availableRoles: data });
        }
      });
  }

  createNestedListNode = ({ classes, translate, label, parentIndex, index, Icon, name, hasChild }) => {
    const level = index.split('.').length;
    if (parentIndex === '-1') {
      if (this.state.switchesStatus) {
        return (
          <Fragment key={`${name}-${index}`}>
            <ListItem button={hasChild} onClick={() => hasChild && this.handleClick(index)}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText inset primary={translate(label)} />
              <ListItemSecondaryAction className={classes[`switchLevel${level}`]}>
                <Switch
                  checked={this.state.switchesStatus[index]}
                  onChange={(_, checked) => this.handleSwitch(index, checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </Fragment>
        );
      }
    }
  };

  displayName = v => {
    if (!v || typeof v !== 'string') return '';
    const ar = v.split('-');
    if (ar.length > 1) {
      return ar.slice(1).join('-');
    }
    return '';
  };

  render() {
    const { translate, classes } = this.props;
    const { availableRoles, saving, selectedRole } = this.state;
    const nestedListNodes =
      selectedRole !== ''
        ? this.state.nestedListNodes.map(({ label, icon, index, parentIndex, apiMark = null, name, hasChild }) =>
            this.createNestedListNode({
              classes,
              translate,
              label,
              parentIndex,
              Icon: icon,
              index,
              handleClick: this.handleClick,
              handleSwitch: this.handleSwitch,
              apiMark,
              name,
              hasChild,
            }),
          )
        : null;
    const roleMenuItem = availableRoles
      ? availableRoles.map(({ name, title }) => (
          <MenuItem key={name} value={this.displayName(name)}>
            {title}
          </MenuItem>
        ))
      : null;

    return (
      <CustomPage
        title="generic.pages.roleAppPermission"
        card
        header
        actions={
          <CardActions style={{ paddingRight: 10 }}>
            <FormControl>
              <InputLabel htmlFor="role-selector">Quyền hạn</InputLabel>
              <Select
                value={this.state.selectedRole}
                onChange={this.handleSelectRole}
                inputProps={{ name: 'selectedRole', id: 'role-selector' }}
                style={{ minWidth: '120px' }}
              >
                {roleMenuItem}
              </Select>
            </FormControl>
            <Button
              primary="true"
              variant="raised"
              label={translate('ra.action.save')}
              saving={saving}
              onClick={this.handleSaveMatrix}
              style={{ marginTop: '14px', marginLeft: '16px' }}
              permission={{ name: 'rolePermission', action: 'save' }}
            >
              <Save />
            </Button>
          </CardActions>
        }
      >
        <List>{nestedListNodes}</List>
      </CustomPage>
    );
  }
}

AppPermissionList.propTypes = {
  dataProvider: PropTypes.func,
  translate: PropTypes.func,
  classes: PropTypes.object,
  showNotification: PropTypes.func,
};

export default compose(translate)(withStyles(styles)(AppPermissionList));
