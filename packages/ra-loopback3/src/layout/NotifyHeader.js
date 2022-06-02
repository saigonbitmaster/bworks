import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
// import Menu from '@material-ui/core/Menu';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
// import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import withDataProvider from '../data/withDataProvider';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

@withDataProvider
export default class NotifyHeader extends Component {
  static propTypes = {
    getTotal: PropTypes.func,
    notifyComponent: PropTypes.any,
    dataProvider: PropTypes.func,
  };

  state = {
    total: 0,
    anchorEl: null,
  };

  componentDidMount() {
    const { getTotal, dataProvider } = this.props;
    getTotal(dataProvider).then(total => {
      if (!this.unmount) {
        this.setState({ total });
      }
    });
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { total, anchorEl } = this.state;
    const { notifyComponent } = this.props;
    if (!total) return null;
   
    return (
      <div>
        <IconButton color="inherit" aria-label="Notification" onClick={this.handleClick}>
          <Badge color="error" badgeContent={total} invisible={false}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {notifyComponent && (
         
           <Menu
           style ={{marginTop: 30}}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
      >
        <MenuItem onClick={this.handleClose}>New posted jobs: 10</MenuItem>
        <MenuItem onClick={this.handleClose}>New bidding jobs: 30</MenuItem>
        <MenuItem onClick={this.handleClose}>New smart contracts: 5</MenuItem>
      </Menu>
        )}
      </div>
    );
  }
}
