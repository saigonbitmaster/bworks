import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  IconButton,
  withStyles,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { compose } from 'recompose';
import { push as pushAction } from 'react-router-redux';
import {
  Apps as AppsIcon,
  Language as LanguageIcon,
  BubbleChart as BubbleChartIcon,
  People as PeopleIcon,
  DeviceHub as DeviceHubIcon,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import {} from '@material-ui/core/colors';

const styles = theme => ({
  rootButton: {
    // width: 250,
  },
  leftIcon: {
    // margin: theme.spacing(1),
    fontSize: 48,
    color: theme.palette.primary.main,
  },
});

const appData = [
  {
    icon: LanguageIcon,
    name: 'Water Organization',
    link: '/org',
  },
  {
    icon: BubbleChartIcon,
    name: 'Water Source',
    link: '/src',
  },
  {
    icon: DeviceHubIcon,
    name: 'Water Supply Network',
    link: '/nms',
  },
  {
    icon: PeopleIcon,
    name: 'Water Customer',
    link: '/ctm',
  },
];

class AppButton extends Component {
  static propTypes = {
    project: PropTypes.string,
    classes: PropTypes.object,
  };

  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  itemClick = () => {
    this.handleClose();
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;
    return (
      <Fragment>
        <Popover
          id="simple-popper"
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <List component="nav" aria-label="main mailbox folders">
            {appData.map(({ name, icon: DataIcon, link }) => (
              <ListItem component="a" href={link} button key={name}>
                <ListItemIcon>
                  <DataIcon className={classes.leftIcon} />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </Popover>
        <Tooltip title="Application System" placement="bottom">
          <IconButton aria-label="Scada" onClick={this.handleClick}>
            <AppsIcon style={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
  }
}

const AppButtonEnhance = compose(connect(undefined, { push: pushAction }), withStyles(styles))(AppButton);

export default AppButtonEnhance;
