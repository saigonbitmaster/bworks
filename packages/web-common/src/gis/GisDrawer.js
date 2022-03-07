import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer, IconButton, withStyles, Divider } from '@material-ui/core';
import { compose } from 'recompose';
import { ChevronRight } from '@material-ui/icons';

class GisDrawer extends Component {
  static propTypes = {
    map: PropTypes.object,
    classes: PropTypes.object,
    drawerFinish: PropTypes.func,
  };

  state = {
    open: true,
  };

  componentDidMount() {
    this.setState({ state: true });
  }

  onClose = () => {
    // console.log('on close');
  };

  cancel = () => {
    this.setState({ open: false }, this.props.drawerFinish);
  };

  render() {
    const { open } = this.state;
    const { classes } = this.props;
    return (
      <Drawer
        onClose={this.onClose}
        variant="persistent"
        anchor="right"
        open={open}
        className={open ? classes.drawerShow : classes.drawerHide}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.cancel}>
            <ChevronRight />
          </IconButton>
        </div>
        <Divider />
        Hello
      </Drawer>
    );
  }
}

const drawerWidth = 300;
const styles = theme => ({
  drawerShow: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerHide: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
});

const EnhanceGisDrawer = compose(withStyles(styles))(GisDrawer);

export default EnhanceGisDrawer;
