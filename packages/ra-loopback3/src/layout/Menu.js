import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { getResources } from 'react-admin';
import { Responsive, DRAWER_WIDTH } from 'ra-ui-materialui/lib';
import _ from 'lodash';
import myAccessAction from '../actions/myAccessAction';
import { push as pushAction } from 'react-router-redux';
import { CUSTOM, withDataProvider, Storage } from '../LocalExport';
import MenuList from './MenuList';

const hasScreensToShow = screen => {
  if (screen && screen.active === false) {
    return null;
  }
  const screens = _.get(screen, 'screens');
  if (screens) return screen;
  else {
    // Two cases: This screen's got children screens in `menu` property
    const menu = _.get(screen, 'menu');
    if (menu) {
      const childrenScreenResult = menu.map(child => hasScreensToShow(child));
      if (childrenScreenResult.some(child => !child)) {
        return null;
      } else {
        return screen;
      }
    } else return null;
  }
};

const hasAllowedAPIs = (screen, allowedAPIs, allowedScreens, type) => {
  if (type === 'master') return screen;
  if (_.isEmpty(allowedScreens)) {
    return {};
  }
  const menu = _.get(screen, 'menu');
  const name = _.get(screen, 'name');
  if (!menu) {
    const access = _.get(screen, 'access');
    if (access) {
      let apis = [];
      if (_.has(access, 'apis')) {
        apis = access.apis;
      } else {
        const accessData = _.values(access);
        apis = _.uniqBy(
          _.compact(_.flatten(accessData.map(({ apis }) => apis))),
          ({ url, method }) => `${url}-${method}`,
        );
      }
      const isPresentInAllowedAPIs =
        _.intersectionWith(apis, allowedAPIs, _.isEqual).length > 0 && allowedScreens[name];
      if (isPresentInAllowedAPIs) {
        return screen;
      } else {
        return {};
      }
    }
  } else {
    const screenHasAllowedAPIs = [];
    for (let item of menu) {
      const result = hasAllowedAPIs(item, allowedAPIs, allowedScreens, type);
      if (!_.isEmpty(result)) {
        screenHasAllowedAPIs.push(result);
      }
    }

    if (!_.isEmpty(screenHasAllowedAPIs)) {
      _.set(screen, 'menu', screenHasAllowedAPIs);
      return screen;
    } else {
      return {};
    }
  }
};

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: DRAWER_WIDTH,
  },
};

const Menu = ({ menuConfig, showToClient }) => {
  // add dict to menu
  let stack = menuConfig.menu.map((item, index) => ({ item, parent: '', path: `[${index}]` }));
  while (stack.length > 0) {
    let data = stack.pop();
    if (data.item.menu && data.item.menu.length > 0) {
      data.item.menu.map((subItem, index) => {
        stack.push({ item: subItem, parent: data.path, path: data.path + `[${index}]` });
      });
    } else if (data.parent) {
      _.set(menuConfig.menu, `${data.parent}.sub['/${data.item.url}']`, true);
    }
  }

  @withDataProvider
  class RaMenu extends Component {
    state = {
      menuConfig: { menu: showToClient ? menuConfig.menu : [] },
    };

    componentDidMount() {
      if (!showToClient) {
        const { myaccess, dataProvider, setMyAccess, push } = this.props;
        if (!myaccess) {
          dataProvider(CUSTOM, 'AppUsers', {
            subUrl: 'myAccess',
            method: 'POST',
            fullUrl: true,
            body: { project: menuConfig.projectKey || 'unknown' },
          })
            .then(res => {
              setMyAccess(res.data);
              this.calculateMenuConfig(res.data);
            })
            .catch(() => {
              Storage.removeUser();
              push('/login');
            });
        } else {
          this.calculateMenuConfig(myaccess);
        }
      }
    }

    calculateMenuConfig(myaccess) {
      const { apiPath = {}, menu = {}, type = '' } = myaccess;
      const [allowedAPIs, allowedScreens] = [
        _.flatten(_.keys(apiPath).map(url => _.keys(apiPath[url]).map(method => ({ method, url })))),
        menu,
      ];

      if (allowedAPIs) {
        const allowedData = _.cloneDeep(menuConfig.menu)
          .map(datum => hasAllowedAPIs(datum, allowedAPIs, allowedScreens, type))
          .filter(datum => !_.isEmpty(datum))
          .filter(screen => hasScreensToShow(screen));
        //render menu from server config 
        //this.setState({ menuConfig: { menu: allowedData } });
        //by pass render menu from server config 
        //this.setState({ menuConfig: { menu: menuConfig.menu } });
        let renderFromServer = menuConfig.renderFromServer || false
        renderFromServer ? this.setState({ menuConfig: { menu: allowedData } }) : this.setState({ menuConfig: { menu: menuConfig.menu } })
      }
    }

    render() {
      const {
        classes,
        className,
        dense,
        hasDashboard,
        onMenuClick,
        resources,
        logout,
        setMyAccess,
        push,
        ...rest
      } = this.props;
      const { menuConfig } = this.state;
      return (
        <div className={classnames(classes.main, className)}>
          <MenuList data={menuConfig.menu} disablePadding {...rest}>
            <Responsive xsmall={logout} medium={null} />
          </MenuList>
        </div>
      );
    }
  }

  RaMenu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuClick: PropTypes.func,
    pathname: PropTypes.string,
    resources: PropTypes.array.isRequired,
    setMyAccess: PropTypes.func,
    myaccess: PropTypes.any,
    dataProvider: PropTypes.func,
    push: PropTypes.func,
  };

  RaMenu.defaultProps = {
    onMenuClick: () => null,
  };

  const mapStateToProps = state => {
    const route = state.router ? state.router : state.routing;
    return {
      resources: getResources(state),
      myaccess: state.sfdata.myaccess,
      pathname: route.location.pathname, // used to force redraw on navigation
    };
  };

  const enhance = compose(
    connect(
      mapStateToProps,
      {
        setMyAccess: myAccessAction,
        push: pushAction,
      }, // Avoid connect passing dispatch in props,
      null,
      {
        areStatePropsEqual: (prev, next) =>
          prev.resources.every(
            (value, index) => value === next.resources[index], // shallow compare resources
          ) && prev.pathname == next.pathname,
      },
    ),
    withStyles(styles),
  );

  return enhance(RaMenu);
};

export default Menu;
