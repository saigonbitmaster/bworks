import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import compose from 'recompose/compose';
import red from '@material-ui/core/colors/red';
import { toggleSidebar as toggleSidebarAction } from 'ra-core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { LoadingIndicator } from 'react-admin';
import NotifyHeader from './NotifyHeader';
import LanguageSetting from './LanguageSetting';
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
  color: theme.status.loss,
  appBar: {
    // transition: theme.transitions.create(['margin', 'width'], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen,
    // }),
    zIndex: 1300,
  },
  toolbar: {
    paddingRight: 24,
    display: 'flex',
  },
  menuButton: {
    marginLeft: '0.5em',
    marginRight: '0.5em',
  },
  notification: {
    marginLeft: '0.5em',
    marginRight: '0.5em',
    badge: {
      color: red[500],
    },
  },
  menuButtonIconClosed: {
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    transform: 'rotate(0deg)',
  },
  menuButtonIconOpen: {
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    transform: 'rotate(180deg)',
  },
  title: {
    flex: 5,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  flex1: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      flex: 1,
    },
  },
  loadingIndicator: {
    //position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1200,
    marginBottom: 14,
    marginTop: 14,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  logout: {
    color: 'white !important',
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  paper: {
    marginRight: theme.spacing(2),
  },
});

const AppBar = ({ classes, className, logout, open, title, toggleSidebar, notifyBage, extBar, ...rest }) => {
  
  return (
    <MuiAppBar className={classNames(classes.appBar, className)} color="secondary" position="absolute" {...rest}>
      <Toolbar disableGutters variant="dense" className={classes.toolbar}>
        <Button
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          className={classNames(classes.menuButton)}
        >
          <MenuIcon
            classes={{
              root: open ? classes.menuButtonIconOpen : classes.menuButtonIconClosed,
            }}
          />
          &nbsp;&nbsp;
          <img src="/static/images/logo-wide.png" height="32px" />
        </Button>
        <Typography variant="h6" color="inherit" className={classes.title}>
          {typeof title === 'string' ? title : React.cloneElement(title)}
        </Typography>
        <span className={classes.flex1} />
        <div className={classes.grow} />
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
        <LoadingIndicator className={classes.loadingIndicator} />
        {extBar &&
          extBar.map(({ key, component: Item }) => {
            return <Item key={key} />;
          })}
        {notifyBage && <NotifyHeader {...notifyBage} />}
        <LanguageSetting />
        {logout &&
          cloneElement(logout, {
            className: classes.logout,
          })}
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  notifyBage: PropTypes.any,
  logout: PropTypes.element,
  open: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  extBar: PropTypes.any,
};

const enhance = compose(
  connect(
    state => ({
      locale: state.i18n.locale, // force redraw on locale change
    }),
    {
      toggleSidebar: toggleSidebarAction,
    },
  ),
  withStyles(styles),
);

export default enhance(AppBar);
