import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { getResources } from 'react-admin';
import { List } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

// import { CUSTOM, withDataProvider } from '../LocalExport.js';
import MenuItemLink from './MenuItemLink';

// eslint-disable-next-line no-unused-vars
const styles = theme => ({
  padding: {
    paddingTop: '0em',
    paddingBottom: '0em',
  },
});

class MenuList extends Component {
  render() {
    const {
      classes,
      className,
      dense,
      hasDashboard,
      onMenuClick,
      resources,
      logout,
      data,
      children,
      disablePadding,
      activeSub,
      ...rest
    } = this.props;

    // let newData = null;
    return (
      <List component="nav" className={classes.padding}>
        {data.map(item => {
          return <MenuItemLink key={item.url + item.name} onClick={onMenuClick} dense={dense} data={item} {...rest} />;
        })}
        {children}
      </List>
    );
  }
}

MenuList.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  dense: PropTypes.bool,
  hasDashboard: PropTypes.bool,
  logout: PropTypes.element,
  onMenuClick: PropTypes.func,
  resources: PropTypes.array.isRequired,
  children: PropTypes.any,
  data: PropTypes.array,
  disablePadding: PropTypes.bool,
  activeSub: PropTypes.func,
};

MenuList.defaultProps = {
  onMenuClick: () => null,
};

const mapStateToProps = state => ({
  resources: getResources(state),
});

const enhance = compose(
  connect(
    mapStateToProps,
    {}, // Avoid connect passing dispatch in props,
  ),
  withStyles(styles),
);

export default enhance(MenuList);
