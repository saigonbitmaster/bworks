import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import { MenuItem, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { translate } from 'react-admin';
import DefaultIcon from '@material-ui/icons/ViewList';

import MenuList from './MenuList';

const styles = theme => ({
  root: {
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'flex-start',
  },
  active: {
    color: theme.palette.primary.main,
  },
  expand: { paddingLeft: '0.6em' },
  icon: { paddingRight: '1.2em' },
  nested: {
    paddingLeft: theme.spacing(1),
  },
});

export class MenuItemLink extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    staticContext: PropTypes.object,
    data: PropTypes.object,
    translate: PropTypes.func.isRequired,
    pathname: PropTypes.string,
    dataProvider: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { data, pathname } = this.props;
    this.state = {
      open: this.hasActiveSub(data, pathname),
      selected: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.pathname !== nextProps.pathname ||
      nextState.open !== this.state.open ||
      nextState.selected !== this.state.selected
    );
  }

  handleMenuTap = () => {
    this.props.onClick && this.props.onClick();
  };

  handleExpand = e => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  };

  hasActiveSub = (data, pathname) => {
    return data.sub && data.sub[pathname];
  };

  renderExpand = (data, classes) => {
    if (this.hasSubMenu(data)) {
      return this.state.open ? <ExpandLess className={classes.expand} /> : <ExpandMore className={classes.expand} />;
    }
    return null;
  };

  renderSubList = ({ data, classes, ...props }) => {
    if (this.hasSubMenu(data)) {
      return (
        <Collapse className={classes.nested} key={'subList'} in={this.state.open} timeout="auto" unmountOnExit>
          <MenuList {...props} data={data.menu} />
        </Collapse>
      );
    }
    return null;
  };

  hasSubMenu = data => {
    return data && data.menu && data.menu.length > 0;
  };

  // eslint-disable-next-line no-unused-vars
  isActive = (match, location) => {
    let result = !!match;
    if (result && (match.url === '/' || match.url === '')) {
      result = match.isExact;
    }
    if (this.state.selected !== result) {
      setTimeout(() => this.setState({ selected: result }), 10);
    }
    return result;
  };

  renderIcon(data, classes, primaryText) {
    if (data.icon)
      return (
        <div className={classes.icon}>
          <data.icon titleAccess={primaryText} />
        </div>
      );
    return (
      <div className={classes.icon}>
        <DefaultIcon titleAccess={primaryText} />
      </div>
    );
  }

  renderText(data, translate) {
    return data.label ? translate(data.label) : data.name;
  }

  render() {
    const { classes, className, staticContext, translate, data, dataProvider, ...props } = this.props;
    const { routeParams = {} } = data;
    let hasSubMenu = this.hasSubMenu(data);
    let handleMenuTap = hasSubMenu ? this.handleExpand : this.handleMenuTap;
    let url = data.url;
    if (routeParams.defaultParams) {
      Object.keys(routeParams.defaultParams).map(key => {
        url = url.replace(`:${key}`, routeParams.defaultParams[key]);
      });
    }
    // eslint-disable-next-line
    const CustomLink = React.forwardRef((props, ref) => <NavLink {...props} />);
    let linkProps = hasSubMenu
      ? {}
      : {
          to: '/' + url,
          activeClassName: classes.active,
          component: CustomLink,
          isActive: (match, location) => this.isActive(match, location),
        };
    return [
      <MenuItem
        key={url + this.selected + data.name}
        className={classnames(classes.root, className)}
        {...props}
        {...linkProps}
        onClick={handleMenuTap}
        selected={this.state.selected || this.state.open}
      >
        {this.renderIcon(data, classes, data.label ? translate(data.label) : data.name)}
        {data.label ? translate(data.label) : data.name}
        {this.renderExpand(data, classes)}
      </MenuItem>,
      this.renderSubList(this.props),
    ];
  }
}

const enhance = compose(translate, withStyles(styles));

export default enhance(MenuItemLink);
