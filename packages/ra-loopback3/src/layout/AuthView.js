import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import get from 'lodash/get';
import withDataProvider from '../data/withDataProvider';
import myAccessAction from '../actions/myAccessAction';
import { CUSTOM } from '../data/LoopbackRest';
import CommonProviderContext from '../data/CommonProviderContext';
class AuthView extends Component {
  static propTypes = {
    children: PropTypes.any,
    saving: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = { accept: false };
  }

  componentDidMount() {
    const { permission } = this.props;
    // console.log('componentDidMount / permission', this.props);
    if (permission) {
      this.access(permission);
    }
  }

  access = permission => {
    // debugger;
    let allow = false;
    if (permission) {
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
    const { permission, menu } = this.props;
    if (myaccess && menu && permission) {
      if (get(myaccess, 'type', '') === 'master') return true;
      const { name, action } = permission || {};
      let apis = this.getActionApis(myaccess, name, action);
      if (apis && apis.length) {
        let different = apis.some(api => {
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
    const { children } = this.props;
    const { accept } = this.state;
    return accept ? children : null;
  }
}

AuthView.propTypes = {
  myaccess: PropTypes.object,
  dataProvider: PropTypes.func,
  userModel: PropTypes.string,
  project: PropTypes.string,
  menu: PropTypes.object,
  permission: PropTypes.object,
  setMyAccess: PropTypes.any,
};

AuthView.defaultProps = {
  userModel: 'appusers',
  project: 'ctm',
};

const EnhanceAuthView = compose(
  withDataProvider,
  connect(
    state => ({
      myaccess: state.sfdata.myaccess,
    }),
    {
      setMyAccess: myAccessAction,
    },
  ),
)(AuthView);

const EnhanceAuthViewPermission = ({ permission, ...rest }) => {
  if (permission) {
    return (
      <CommonProviderContext.Consumer>
        {({ menu }) => <EnhanceAuthView {...rest} menu={menu} permission={permission} />}
      </CommonProviderContext.Consumer>
    );
  }
  return <EnhanceAuthView {...rest} />;
};

// new add
EnhanceAuthViewPermission.propTypes = {
  permission: PropTypes.any,
};

export default EnhanceAuthViewPermission;
