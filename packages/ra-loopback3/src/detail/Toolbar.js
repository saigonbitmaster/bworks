import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Toolbar as RawToolbar } from 'react-admin';

const styles = theme => ({
  toolbar: {
    paddingLeft: `${theme.spacing(2)}px`,
    '& button': {
      margin: '10px 24px',
    },
  },
});

@withStyles(styles)
class Toolbar extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  render() {
    const { classes, ...props } = this.props;
    return <RawToolbar className={classes.toolbar} {...props} />;
  }
}

export default Toolbar;
