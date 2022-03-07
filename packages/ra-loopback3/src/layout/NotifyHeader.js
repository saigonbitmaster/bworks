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
    // debugger;
    // return (
    //   <Fragment>
    //     <IconButton color="inherit" aria-label="Notification" onClick={this.handleClick}>
    //       <Badge color="error" badgeContent={total} invisible={false}>
    //         <NotificationsIcon />
    //       </Badge>
    //     </IconButton>
    //     {notifyComponent && (
    //       <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
    //         {createElement(notifyComponent, { anchorEl, handleClose: this.handleClose, open: Boolean(anchorEl) })}
    //       </Menu>
    //     )}
    //   </Fragment>
    // );
    return (
      <div>
        <IconButton color="inherit" aria-label="Notification" onClick={this.handleClick}>
          <Badge color="error" badgeContent={total} invisible={false}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {notifyComponent && (
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={this.anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {createElement(notifyComponent, {
                        anchorEl,
                        handleClose: this.handleClose,
                        open: Boolean(anchorEl),
                      })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        )}
        {/* {notifyComponent && (
          <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
            {createElement(notifyComponent, { anchorEl, handleClose: this.handleClose, open: Boolean(anchorEl) })}
          </Menu>
        )} */}
      </div>
    );
  }
}
