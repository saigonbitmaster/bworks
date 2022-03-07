import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withStyles, AppBar, Toolbar, Link } from '@material-ui/core';

class Footer extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  // preventDefault = event => event.preventDefault();

  render() {
    const { classes } = this.props;
    return (
      <AppBar className={classes.root}>
        <Toolbar className={classes.toolbar} variant="dense">
          <i>
            © {new Date().getFullYear()}, Copyright by{' '}
            <Link className={classes.link} href="http://Bworks.online">
              Bworks
            </Link>
            . All right reserved
          </i>
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = () => ({
  root: {
    position: 'absolute',
    top: 'auto',
    bottom: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'underline',
  },
  toolbar: {
    fontSize: 'small',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose(withStyles(styles))(Footer);
