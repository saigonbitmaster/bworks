import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import { Button as RawButton } from 'react-admin';
import { Link } from 'react-router-dom';
import withDataProvider from '../data/withDataProvider';
import myAccessAction from '../actions/myAccessAction';
import { CUSTOM } from '../data/LoopbackRest';
import CommonProviderContext from '../data/CommonProviderContext';
import CircularProgress from './CircularProgress';
class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { accept: true };
  }

  componentDidMount() {
    const { permission } = this.props;
    // console.log('componentDidMount / permission', permission);
    if (permission) {
      this.access(permission);
    }
  }

  access = permission => {
    // debugger;
    let allow = false;
    if (permission) {
      // if (!allow) return true;
      const { myaccess, userModel, dataProvider, setMyAccess, project } = this.props;
      if (myaccess) {
        allow = this.checkPermissionWithAccessData(myaccess);
        this.setState({ accept: allow });
      } else {
        dataProvider(CUSTOM, userModel, {
          subUrl: 'myAccess',
          body: { project },
          method: 'post',
        }).then(res => {
          if (res.data) {
            setMyAccess(res.data); // save my access to redux
            allow = this.checkPermissionWithAccessData(res.data);
            this.setState({ accept: allow });
          }
        });
      }
    } else {
      this.setState({ accept: allow });
    }
  };

  checkPermissionWithAccessData = myaccess => {
    // console.log('>>myaccess', myaccess);
    const { permission, menu } = this.props;
    // console.log('>this.props', this.props);
    if (myaccess && menu && permission) {
      if (get(myaccess, 'type', '') === 'master') return true;
      const { name, action } = permission || {};
      let apis = this.getActionApis(myaccess, name, action);
      if (apis && apis.length) {
        let different = apis.some(api => {
          // console.log('test: ', myaccess.menu[name][action], myaccess.menu, name, action);

          // if (
          //   !(
          //     myaccess.apiPath[api.url] &&
          //     myaccess.apiPath[api.url][api.method] &&
          //     myaccess.menu[name] &&
          //     myaccess.menu[name][action] === true
          //   )
          // ) {
          //   console.log('permission: ', permission);
          //   console.log('my access:', myaccess);
          //   console.log('list apis:', apis);
          //   console.log('my api different:', api);
          //   console.log('status action:', myaccess.menu[name]);
          // }

          // kiem tra co bat ki api khong giong ?
          //    + return true: co khong giong
          return !(
            get(myaccess, `apiPath[${api.url}]`) &&
            get(myaccess, `apiPath[${api.url}][${api.method}]`) &&
            get(myaccess, `menu[${name}]`) &&
            get(myaccess, `menu[${name}][${action}]`) === true
          );
        });
        return !different;
      }
    }
    return false;
  };

  getActionApis = (myaccess, name, action) => {
    const { menu } = this.props;
    let apis = get(menu, `accessMap.${name}.${action}.apis`);
    return apis;
  };

  render() {
    const {
      children,
      saving,
      disabled,
      permission,
      dataProvider,
      menu,
      setMyAccess,
      userModel,
      isLink,
      linkTo,
      innerClass,
      basePath,
      ...rest
    } = this.props;
    const { accept } = this.state;
    // console.log(accept, disabled, saving, !!saving);
    if (isLink && linkTo) {
      if (!accept || disabled || !!saving) {
        return <Typography {...rest}>{children}</Typography>;
      } else {
        return (
          <Typography className={innerClass} component={Link} to={linkTo} {...rest}>
            {children}
          </Typography>
        );
      }
    }
    return (
      <RawButton disabled={!accept || disabled || !!saving} {...rest}>
        {saving ? <CircularProgress /> : children}
      </RawButton>
    );
  }
}

Button.propTypes = {
  myaccess: PropTypes.object,
  dataProvider: PropTypes.func,
  userModel: PropTypes.string,
  project: PropTypes.string,
  menu: PropTypes.object,
  innerClass: PropTypes.any,
  isLink: PropTypes.bool,
  linkTo: PropTypes.string,
  basePath: PropTypes.any,
  children: PropTypes.any,
  saving: PropTypes.any,
  permission: PropTypes.any,
  setMyAccess: PropTypes.any,
  disabled: PropTypes.any,
};

Button.defaultProps = {
  userModel: 'appusers',
  project: 'ctm',
};

const EnhanceButton = compose(
  withDataProvider,
  connect(
    state => ({
      myaccess: state.sfdata.myaccess,
    }),
    {
      setMyAccess: myAccessAction,
    },
  ),
)(Button);

const EnhanceButtonPermission = ({ permission, ...rest }) => {
  if (permission) {
    return (
      <CommonProviderContext.Consumer>
        {({ menu }) => <EnhanceButton {...rest} menu={menu} permission={permission} />}
      </CommonProviderContext.Consumer>
    );
  }
  return <EnhanceButton {...rest} />;
};

// new add
EnhanceButtonPermission.propTypes = {
  permission: PropTypes.any,
};

export default EnhanceButtonPermission;
