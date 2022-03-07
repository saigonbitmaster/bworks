import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';

export default class Notify extends Component {
  static propTypes = {
    handleClose: PropTypes.func,
  };

  render() {
    const { handleClose } = this.props;
    return (
      <Fragment>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PriorityHighIcon />
          </ListItemIcon>
          <Typography variant="inherit">Alert abc</Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PriorityHighIcon />
          </ListItemIcon>
          <Typography variant="inherit">A very long text that overflows</Typography>
        </MenuItem>
      </Fragment>
    );
  }
}
